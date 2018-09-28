const pdfMakePrinter = require('pdfmake/src/printer');
const path = require('path');
const DishModel = require('./models/Dish');
const OrderModel = require('./models/Order');
class GlobalResponse {
    constructor(error, response = {}) {
        this.error = error;
        this.response = response;
    }
}

module.exports = function (app, moongoose) {

    //get all dishes
    app.get('/api/dishes', (req, resp) => {
        DishModel.find({}, (err, docs) => {
            if (err) {
                //internal server eror
                console.log(err);
                return resp.status(500).json();
            }
            return resp.json(new GlobalResponse(false, docs));
        })
    })

    //get one dish
    app.get('/api/dish/:id', (req, resp) => {
        var id = req.params.id;
        DishModel.find({ _id: id }, (err, docs) => {
            if (err) {
                //internal server eror
                console.log(err);
                return resp.status(500).json();
            }
            if (docs.length == 0) {
                return resp.json(new GlobalResponse("invalid id"))
            }
            return resp.json(new GlobalResponse(false, docs[0]));
        })
    })

    //place an order
    app.post('/api/order', (req, resp) => {
        var dishId = req.body.dishId;
        var quantity = req.body.quantity;
       
        OrderModel.findOne({dishId:dishId},(err,docs)=>{
            if(err)
            {
                console.log(err);
                return resp.status(500).json();
            }
            if(!docs)
            {
                var order = new OrderModel({ dishId:dishId, quantity:quantity });
                order.save((err, result) => {
                    if (err) {
                        console.log(err);
                        return resp.status(500).json();
                    }
                    return resp.send(new GlobalResponse(false,"Order placed!"));
                }); 
            }
            else
            {
                
                OrderModel.updateOne({ dishId:dishId }, { $set: { quantity:docs.quantity + quantity } }, (err, result) => {
                    if(err)
                    {
                        console.log(err);
                        return resp.status(500).json();
                    }
                    return resp.send(new GlobalResponse(false,"Since the order already exists, just the quantity value is updated!"));
                });
            }
        });
     
    })

    //get all orders
    app.get('/api/orders', (req, resp) => {
        OrderModel.aggregate([{
            $lookup: {
                from: "dishes", // collection name in db
                localField: "dishId",
                foreignField: "_id",
                as: "x"
            }
        }]).exec(function (err, docs) {
            if (err) {
                console.log(err);
                return resp.status(500).json()
            }
            docs.forEach(obj => {
                obj.name = obj.x[0].name;
                obj.createdTillNow = obj.x[0].createdTillNow;
                obj.predicted = obj.x[0].predicted;
                delete obj.x;
            })
            resp.json(new GlobalResponse(false, docs))
        });
    });

    //update dish predicted or created till now value
    app.put('/api/dish', (req, resp) => {
        var id = req.body.dishId;
        var predicted = req.body.predicted;
        var createdTillNow = req.body.createdTillNow;
        DishModel.updateOne({ _id: id }, { $set: { predicted: predicted, createdTillNow: createdTillNow } }, (err, result) => {
            if (err) {
                console.log(err);
                return resp.status(500).json();
            }
            return resp.json(new GlobalResponse(false));
        })
    })

    //pdf report creation
    app.get('/api/generateReport', (req, resp) => {
        DishModel.find({}, (err, docs) => {
            if (err) {
                //internal server eror
                console.log(err);
                return resp.status(500).json();
            }
            var arr = [];
            arr.push([{ text: 'Dish Id', style: 'tableHeader' },{ text: 'Dish Name', style: 'tableHeader' }, { text: 'Produced', style: 'tableHeader' }, { text: 'Predicted', style: 'tableHeader' }]);
            docs.forEach(obj => {
                arr.push([obj._id+'',obj.name, obj.createdTillNow + '', obj.predicted + '']);
            });
            var docDefinition = {
                content: [
                    { text: 'DALVIROO', style: 'title', alignment: 'center' },
                    { text: 'Generated Report', style: 'header' },
                    {
                        style: 'tableExample',
                        table: {
                            widths: [50,200, 100, 100],
                            headerRows: 1,
                            body: arr
                        }
                    }
                ],
                styles: {
                    header: {
                        fontSize: 16,
                        bold: false,
                        margin: [0, 0, 0, 10]
                    },
                    title: {
                        fontSize: 20,
                        bold: true,
                        margin: [0, 0, 0, 20]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                }
            };
            generatePdf(docDefinition, (response) => {
                resp.setHeader('Content-Type', 'application/pdf');
                resp.send(response);
            });

        })
    })
    app.get('*', (req, resp) => {
        resp.sendFile(path.join(__dirname, 'public/index.html'));
    });
}

//pdf generating logic
function generatePdf(docDefinition, callback) {
    try {
        var fonts = {
            Roboto: {
                normal: 'fonts/Roboto-Regular.ttf',
                bold: 'fonts/Roboto-Medium.ttf'
            }
        };
        const printer = new pdfMakePrinter(fonts);
        const doc = printer.createPdfKitDocument(docDefinition);

        let chunks = [];

        doc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        doc.on('end', () => {
            callback(Buffer.concat(chunks));
        });

        doc.end();

    } catch (err) {
        throw (err);
    }
}
//module imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const db = require('./config/database');
const app = express();
const port = process.env.PORT || 3000;

//db connection
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
    .then(() => { console.log("mongodb connected...") })
    .catch(err => console.log("mongodb error:", err))

//middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//cors
var corsSettings = {
    origin: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors(corsSettings));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin, access-control-allow-headers");
    next();
});

//loading REST APIs from apiRoutes.js
require('./apiRoutes')(app, mongoose);

//starting the server
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});

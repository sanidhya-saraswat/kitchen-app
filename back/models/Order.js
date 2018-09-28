const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    dishId: Number,
    quantity: Number
}, { versionKey: false });
var OrderModel = mongoose.model('orders', OrderSchema);
module.exports = OrderModel;
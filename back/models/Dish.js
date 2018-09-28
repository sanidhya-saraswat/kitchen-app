const mongoose = require('mongoose');
const DishSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    createdTillNow: Number,
    predicted: Number
}, { versionKey: false });
var DishModel = mongoose.model('dishes', DishSchema);
module.exports = DishModel;
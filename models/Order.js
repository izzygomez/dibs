// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var orderSchema = new Schema({
  _id: Number,
	drink: String,
  from: {type: Number, ref: 'User'},
  timeStamp: Date,
  status: Number
});

// TODO create private and public methods
// e.g. "var f = function (...) {...}" is private;
//      "[schema].statics.f = function (...) {...}" is public

var Order = mongoose.model('Order', orderSchema);

/*
Changes the status of an order
*/
orderSchema.statics.changeStatus = function(_id, newStatus, callback) {}

module.exports = Order;
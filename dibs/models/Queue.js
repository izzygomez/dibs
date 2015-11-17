// Main Author: Daniel Lerner


// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var queueSchema = new Schema({
  _id: Number,
	orders: [{type: Number, ref: 'Order'}]
});

// TODO create private and public methods
// e.g. "var f = function (...) {...}" is private;
//      "[schema].statics.f = function (...) {...}" is public

var Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
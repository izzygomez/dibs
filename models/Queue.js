// Main Author: Daniel Lerner


// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var queueSchema = new Schema({
  _id: Number,
	orders: [{type: Number, ref: 'Order'}]
});

queueSchema.statics.getEventOrders = function(queueID, callback){
	var result;
	Queue.findOne({_id: queueID}, function(err, queue){
		if (queue == null){
			result = null;
		}
		else{
			result = queue.orders
		}
		callback(result)
	});
}
// TODO: remove drink order from orders list
queueSchema.statics.getDrinkOrder = function(orders, orderID){
	orders.foreach(function(order, orderID){
		if (order._id == orderID){
			return order
		}
	})
}

queueSchema.statics.addDrinkOrder = function(drink, callback){
	var result;
	Queue.create(drink)
	callback(null)
}

// TODO create private and public methods
// e.g. "var f = function (...) {...}" is private;
//      "[schema].statics.f = function (...) {...}" is public

var Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
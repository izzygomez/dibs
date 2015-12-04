// Main author: Sara Stiklickas

// grab the things that we need
var mongoose = require('mongoose');
var Queue = require('./Queue');

var Schema = mongoose.Schema;

// create a schema
var orderSchema = new Schema({
    _id: Number,
	drink: String,
	from: {type: Number, ref: 'User'},
	timeStamp: Date,
	status: Number
});

/*
Checks if the specified order exists in the database
*/
var orderExists = function(orderID, callback) {
	var exists = null;
	Order.findOne({_id: orderID}, function(err, order) {
		if (err) {
			console.log(err);
		}
		if (order === null) {
			exists = false;
		} else {
			exists = true;
		}
		callback(exists);
	});
}

/*
Gets an order, given the order ID
*/
orderSchema.statics.getOrder = function(orderID, callback) {
	orderExists(orderID, function(exists) {
		if (exists) {
			Order.findOne({_id: orderID}, function(err, found) {
				callback(found);
			});
		} else {
			callback(null);
		}
	});
}

/*
Creates an order and puts it in the queue
Order statuses:
	0: queued,
	1: ready,
	2: served
*/
orderSchema.statics.createOrder = function(drink, fromUser, callback) {
	Order.find().exec(function(err, orderList) {
		if (err) {
			console.log(err);
		} else {
			var orderID = orderList.length;
			var data = {_id: orderID, drink: drink, from: fromUser, 
						timeStamp: Date.now(), status: 0};
			Order.create(data);
			callback(orderID);
		}
	});
}

/*
Changes the status of an order, given the order ID
Order status can be changed to: 
	1: ready,
	2: served
*/
orderSchema.statics.changeStatus = function(orderID, newStatus, callback) {
	orderExists(orderID, function(exists) {
		if (exists) {
			Order.update({_id: orderID}, {status: newStatus},
						 {upsert: true}, function(){});
			callback(null);
		} else {
			callback({msg: 'Invalid order.'});
		}
	});
}

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;
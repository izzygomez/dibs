// Main author: Sara Stiklickas

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

var Order = mongoose.model('Order', orderSchema);

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
var getOrder = function(orderID, callback) {
	var order = null;
	orderExists(orderID, function(exists) {
		if (exists) {
			Order.findOne({_id: orderID}, function(err, found) {
				if (found === null) {
					order = null;
				} else {
					order = found;
				}
				callback(order);
			});
		}
	});
}

/*
Changes the status of an order, given the order ID
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

/*
Gets the drink from an order, given the order ID
*/
orderSchema.statics.getDrink = function(orderID, callback) {
	getOrder(orderID, function(order) {
		var drink = order.drink;
		callback(null, drink);
	});
}

/*
Gets the timestamp of an order, given the order ID
*/
orderSchema.statics.getTime = function(orderID, callback) {
	getOrder(orderID, function(order) {
		var timeStamp = order.timeStamp;
		callback(null, timeStamp);
	});
}

module.exports = Order;
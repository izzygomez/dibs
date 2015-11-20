// Main Author: Daniel Lerner


// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var queueSchema = new Schema({
  _id: Number,
	orders: [{type: Number, ref: 'Order'}]
});

/**
* Returns true if user stored in store, false otherwise
* @param username: username to look up in store
**/
var queueExists = function(queueID, callback)
{
  var exists = null;
  User.findOne({_id: queueID}, function(err, queue)
  {
    if (queue == null)
    {
      exists = false
    }
    else
    {
      exists = true;
    }
    callback(exists);
  });
}

queueSchema.statics.getEventOrders = function(queueID, callback){
	var orders;
	queueExists(queueID, function(exists){
		if (exists){
			Queue.findOne({_id: queueID}, function(err, queue){
				if (queue == null){
					orders = null;
				}
				else{
					orders = queue.orders
				}
				callback(orders)
			});
		}
		else {
			callback({msg: "Invalid Queue ID"});
		}
	});
}

queueSchema.statics.getNextOrder = function(queueID, callback)
{
	getEventOrders(queueID, function(orders){
		nextOrder = orders.shift()
		Queue.update({_id: queueID}, {$pop: {orders: -1}});
		callback(null, nextOrder)
	});
}

queueSchema.statics.addDrinkOrder = function(queueID, drink, callback){
	getEventOrders(queueID, function(orders){
		orders.push(drink)
		Queue.update(_id: queueID, {$push: {orders: orders}});
	})
	callback(null)
}

var Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
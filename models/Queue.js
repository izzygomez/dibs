// Main Author: Daniel Lerner

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Create the Queue schema 
* Defined by id, and a list of drink orders.
* Each drink has an id referncing an Order
*/
var queueSchema = new Schema({
  _id: Number,
	orders: [{type: Number, ref: 'Order'}]
});

/**
* Checks if queue exists in database
* @param: queueID: ID of queue to check database for
* returns true if queue stored in database, false otherwise
**/
var queueExists = function(queueID, callback){
  var exists = null;
  Queue.findOne({_id: queueID}, function(err, queue){
    if (queue == null){
      exists = false}
    else{
      exists = true;
    }
    callback(exists);
  });
}

/**
* Get target Queue using inputted id
* @param: queueID: ID of queue to check database for
* returns queue object if found in database, null otherwise
**/
queueSchema.statics.getQueue = function(queueID, callback){
  var result;
  Queue.findOne({_id: queueID}, function(err, queue){
    if (queue == null){
      result = null;
    }
    else{
      result = queue
    }
    callback(result);
  });
}

/*
* Gets list of drink orders on Queue
* @param: queueID: ID of queue to check database for
* returns list of drink orders for desired queue
* Error message thrown if queue ID invalid
*/
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

/**
* Gets next drink order on Queue, updates database
* @param: queueID: ID of queue to check database for
returns an Order that is next up in the Queue order
**/
queueSchema.statics.getNextOrder = function(queueID, callback) {
	Queue.getEventOrders(queueID, function(orders){
		nextOrder = orders.shift()
		Queue.update({_id: queueID}, {$pop: {orders: -1}}, function(){});
		callback(null, nextOrder)
	});
}

/**
* Adds drink order to Queue, updates database
* @param: queueID: ID of queue to check database for
* orderID: ID of drink order to add to queue
**/
queueSchema.statics.addDrinkOrder = function(queueID, orderID, callback){
	Queue.getEventOrders(queueID, function(orders){
		orders.push(orderID);
		Queue.update({_id: queueID}, {$set: {orders: orders}}, function(){});
    callback(null);
	});
}

/**
* Creates new Queue for event
* @param: queueID: ID for new Queue to be added to database
**/
queueSchema.statics.createQueue = function(queueID, callback){
  queueExists(queueID, function(result){
    if (result){
      callback({taken: true});
    }
    else{
      var data = {_id: queueID, orders: []};
      Queue.create(data);
      callback(null);
    }
  });
}

var Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
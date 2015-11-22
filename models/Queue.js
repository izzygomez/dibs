// Main Author: Daniel Lerner

// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var queueSchema = new Schema({
  _id: Number,
	orders: [{type: Number, ref: 'Order'}]
});

/**
* Checks if queue exists in database
**/
var queueExists = function(queueID, callback)
{
  var exists = null;
  Queue.findOne({_id: queueID}, function(err, queue)
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

/**
* Get Queue using inputted id
**/
queueSchema.statics.getQueue = function(queueID, callback)
{
  var result;
  Queue.findOne({_id: queueID}, function(err, queue)
  {
    if (queue == null)
    {
      result = null;
    }
    else
    {
      result = queue
    }
    callback(result);
  });
}

/*
* Gets list of orders currently in Queue for event
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
**/
queueSchema.statics.getNextOrder = function(queueID, callback)
{
	getEventOrders(queueID, function(orders){
		nextOrder = orders.shift()
		Queue.update({_id: queueID}, {$pop: {orders: -1}});
		callback(null, nextOrder)
	});
}

/**
* Adds drink order to Queue, updates database
**/
// need a callback function in update?? peep user model
queueSchema.statics.addDrinkOrder = function(queueID, order, callback){
	getEventOrders(queueID, function(orders){
		orders.push(order)
		Queue.update(_id: queueID, {$push: {orders: orders}});
	})
	callback(null)
}

/**
* Creates new Queue for event
**/
queueSchema.statics.createQueue = function(queueID, callback){
  queueExists(queueId, function(result){
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
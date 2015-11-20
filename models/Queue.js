// Main Author: Daniel Lerner


// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var queueSchema = new Schema({
  _id: Number,
	orders: [{type: Number, ref: 'Order'}]
});


userSchema.statics.getUser = function(username, callback)
{
  var result;
  User.findOne({username: username}, function(err, user)
  {
    if (user == null)
    {
      result = null;
    }
    else
    {
      result = user
    }
    callback(result);
  });
}

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

queueSchema.statics.getDrinkOrder = function(orders, orderID){
	orders.foreach(function(order, orderID){
		if (order._id == orderID){
			return order
		}
	})
}

queueSchema.statics.addDrinkOrder = function(callback)
{
	var result;
}

// TODO create private and public methods
// e.g. "var f = function (...) {...}" is private;
//      "[schema].statics.f = function (...) {...}" is public

var Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
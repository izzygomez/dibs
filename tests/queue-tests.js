// Main Author: Brian Saavedra

var assert = require("assert");
var Queue = require('../models/Queue');
var Order = require('../models/Order');

describe('Queue', function() {
	// Create a queue to run the tests with.
	Queue.createQueue(1, function(){});

	// First function
  	describe('#getQueue', function (){
    	it('Should return the correct queue', function () {
	    	var queueID = 1;
	    	var currentQueue = {_id: 1, orders: []};
	    	Queue.getQueue(queueID, function(queue){
	    		assert.deepEqual(queue, currentQueue);
	    		done();
	    	});
    	});

    	it('Should return null since the queue does not exist', function(){
    		var queueID = 50;
    		Queue.getQueue(queueID, function(queue){
    			assert.equal(null, queue);
    			done();
    		});
    	});
    });

  	// First, we have to make an order.
   	// Order number will be 0 since it is the first order made.
  	Order.createOrder('Margarita', 10, function(){});
  	Queue.addDrinkOrder(1, 0, function(){});

    // Second function
    describe('#getEventOrders', function(){
    	it('Should get the orders from the queue', function(){
    		var queueID = 1;
    		var currentOrders = [0];
    		Queue.getEventOrders(queueID, function(orders){
    			assert.deepEqual(currentOrders, orders);
    			done();
    		});
    	});
    });

    // Third function 
    describe('#getNextOrder', function(){
    	it('Should get the next order from the queue, make sure queue is empty at the end', function(){
    		var queueID = 1;
    		var currentOrder = 0;
    		Queue.getNextOrder(queueID, function(err, order){
    			assert.equal(currentOrder, order);
    			Queue.getEventOrders(queueID, function(orders){
    				assert.deepEqual(orders, []);
    				done();
    			});
    		});
    	});
    });


});
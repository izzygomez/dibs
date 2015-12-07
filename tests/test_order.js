var assert = require("assert");
var Order = require("../models/Order");

describe('Order', function() {

	/*
	Testing createOrder by using it for other functions,
	with 12345 as a fake userID. OrderID should be 0. 
	*/
	var now = Date.now();
	Order.createOrder("Water", 12345, function(){});

	describe('#getOrder()', function(){
		it('should get the order with the given ID', function() {
			Order.getOrder(0, function(order) {
				assert.deepEqual({_id: 0, drink: "Water", from: 12345,
								  timeStamp: now, _status: 0}, order);
				done();
			});
		});
	});

	describe('#changeStatus()', function(){
		it('should change the status of the order', function() {
			Order.changeStatus(0, 1, function(){});
			Order.getOrder(0, function(order) {
				assert.deepEqual({_id: 0, drink: "Water", from: 12345,
								  timeStamp: now, _status: 1}, order);
				done();
			});
		});
	});

});
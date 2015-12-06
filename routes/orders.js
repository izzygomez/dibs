// Main Author: Sara Stiklickas

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Order = require('../models/Order');
var Queue = require('../models/Queue');
var Menu = require('../models/Menu');
var Event = require('../models/Event');

/*
POST /orders
Request body:
  - drink: the drink ordered
  - from: the user who ordered the drink
Response:
  - success: true if the order has been created and added to the queue
  - err: on failure, an error message
*/
router.post('/', function(req, res) {
	Event.checkLimit(req.user._id, req.body.eventID, function(noneLeft) {
		if (!noneLeft) {
			Order.createOrder(req.body.drink, req.user._id, function(orderID){
				Event.decreaseLimit(req.user._id, req.body.eventID, function(err) {
					if (err) {
						utils.sendErrResponse(res, 500, 'An unknown error occurred');
					} else {
						Menu.updateStock(req.body.eventID, req.body.drink, function(err){
							if (err) {
								utils.sendErrResponse(res, 500, 'out of stock');
							} else {
								Queue.addDrinkOrder(req.body.eventID, orderID, function(err){
									if (err) {
										utils.sendErrResponse(res, 500, 'An unknown error occurred.');
									} else {
										utils.sendSuccessResponse(res, {orderID: orderID});
									}
								});
							}
						});						
					}
				});
			});
		} else {
			utils.sendErrResponse(res, 500, 'reached limit');
		}
	});
});

/*
POST /orders/served
Request body: 
  - orderID: the ID of the order that has been served
Response:
  - success: true if the order status has been changed to served(2)
  - err: on failure, an error message
*/
router.post('/served', function(req, res) {
	Order.changeStatus(req.body.orderID, 2, function(err) {
		if (err) {
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
			utils.sendSuccessResponse(res);
		}
	});
});

/*
POST /orders/notified
Request body: 
  - orderID: the ID of the order that has been served
Response: 
  - success: true if the order status has been changed to ready(1)
  - err: on failure, an error message
*/
router.post('/notified', function(req, res) {
	Order.changeStatus(req.body.orderID, 1, function(err) {
		if (err) {
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
			utils.sendSuccessResponse(res);
		}
	});
});

/*
GET /orders/status
No request parameters
Response:
  - success: true if the status of the order has been obtained, contains status
  - err: on failure, an error message
*/
router.get('/status', function(req, res) {
	Order.getOrder(req.query.orderID, function(order) {
		if (order) {
			utils.sendSuccessResponse(res, {_status: order._status});
		} else {
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		}
	});
});

module.exports = router;

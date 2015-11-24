// Main Author: Sara Stiklickas

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Order = require('../models/Order');
var Queue = require('../models/Queue');

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
	Order.createOrder(req.body.drink, req.user._id, function(orderID){
		Queue.addDrinkOrder(req.body.eventID, orderID, function(err){
			if (err) {
				utils.sendErrResponse(res, 500, 'An unknown error occurred.');
			} else {
				utils.sendSuccessResponse(res, {orderID: orderID});
			}
		});
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
	Order.getOrder(req.body.orderID, function(order) {
		if (order) {
			utils.sendSuccessResponse(res, {status: order.status});
		} else {
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		}
	});
});

module.exports = router;

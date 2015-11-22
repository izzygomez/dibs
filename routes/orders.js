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
	Order.createOrder(req.drink, req.from, function(orderID){
		Order.getOrder(orderID, function(order) {
			Queue.addDrinkOrder(req.eventID, order, function(err){
				if (err) {
					utils.sendErrResponse(res, 500, 'An unknown error occurred.');
				} else {
					utils.sendSuccessResponse(res);
				}
			});
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
	Order.changeStatus(req.orderID, 2, function(err) {
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
	Order.changeStatus(req.orderID, 1, function(err) {
		if (err) {
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
			utils.sendSuccessResponse(res);
		}
	});
});


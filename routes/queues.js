// Main Author: Daniel Lerner

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Queue = require('../models/Queue');
var Menu = require('../models/Menu');
var User = require('../models/User');
var Order = require('../models/Order');
var Event = require('../models/Event');

/**
POST /queue/served
  Request body:
    - id of queue to take drink off of
  Response:
    - success: true if target drink removed from queue; false otherwise
    - err: on error, an error message
**/
router.post('/served', function(req, res) {
  Queue.getNextOrder(req.body._id,
    function(err) {
      if (err) {
          utils.sendErrResponse(res, 500, 'Drink Order not retrieved');
      } 
      else {
        utils.sendSuccessResponse(res, req.body._id);
      }
  });
});

/*
GET /queue
Request Parameters:
  - queueID: the ID of the event and queue
Response:
  - success: true if the server succeeded in getting the queue orders
  - content: on success, a list of objects with the following attributes:
      drink: the drink that was ordered
      timeStamp: the time at which the order was placed
      fromUser: the user who made the order
  - err: on failure, an error message
*/
router.get('/', function(req, res) {
  Queue.getQueue(req.query.queueID, function(queue) {
    if (queue) {
      Menu.getMenu(req.query.queueID, function(menu) {
        var orderIDs = queue.orders;
        var orderAttributes = [];
        if (orderIDs.length === 0){
          res.render('blankQueue', {menu: menu, queueID: req.query.queueID});
        }
        orderIDs.forEach(function(orderID, i, orderIDs) {
            Order.getOrder(orderID, function(order) {
                User.getUser(order.from, function(exists, user) {
                    orderAttributes.push({drink: order.drink, timeStamp: order.timeStamp, fromUser: user.username, fromUserID: user._id, status: order._status, orderID: orderID});  
                    if (i===orderIDs.length-1) {
                      res.render('queue', {menu: menu, orderAttributes: orderAttributes, queueID: req.query.queueID});
                    }
                });
            });
        });
      });
    } 
    else {
      utils.sendErrResponse(res, 500, 'Queue not retrieved');
    }
  });
});

module.exports = router;
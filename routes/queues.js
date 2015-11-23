// Main Author: Daniel Lerner

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Queue = require('../models/Queue');

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
          utils.sendErrResponse(res, 500, 'An unknown error has occurred.');
      } 
      else {
        utils.sendSuccessResponse(res, req.body._id);
      }
  });
});
var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Queue = require('../models/Queue');

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
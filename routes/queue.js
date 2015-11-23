var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Queue = require('../models/Queue');

/**
POST /users/follows
  Request body:
    - username of user to follow
    - username of current signed in user
  Response:
    - success: true if target user follow succeeded; false otherwise
    - err: on error, an error message
**/
router.post('/served', function(req, res) {
  Queue.getNextOrder(req.body._id,
    function(err) {
      if (err) {
        if (err.taken) {
          utils.sendErrResponse(res, 400, 'That Queue is already created!');
        } else {
          utils.sendErrResponse(res, 500, 'An unknown error has occurred.');
        }
      } 
      else {
        utils.sendSuccessResponse(res, req.body._id);
      }
  });

  router.post('/create', function(req, res) {

  Queue.createQueue(req.body._id,
    function(err) {
      if (err) {
        if (err.taken) {
          utils.sendErrResponse(res, 400, 'That Queue is already created!');
        } else {
          utils.sendErrResponse(res, 500, 'An unknown error has occurred.');
        }
      } else {
        utils.sendSuccessResponse(res, req.body._id);
      }
  });
});
});
//Main Author: Daniel Lerner

var express = require('express');
var router = express.Router();
var Event = require('../models/Event');
var Order = require('../models/Order');
var utils = require('../utils/utils');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index');
});

/* GET guestPreEvent page. */
router.get('/guestPreEvent', function(req, res, next) {
  Event.findByID(req.query.eventID, function(err, _event){
    Event.isHappening(req.query.eventID, function(err, result){
      if (result){
        var happen = {happening: true};
        utils.sendSuccessResponse(res, happen);
      }
      else{
        var happen = {happening: false};
        res.render('guestPreEvent', happen);
      }
    });
  });
});

/* GET hostPreEvent page. */
router.get('/hostPreEvent', function(req, res) {
  console.log("host pre event");
  Event.findByID(req.query.eventID, function(err, _event){
    Event.isHappening(req.query.eventID, function(err, result){
      if(result){
        var happen = {happening: true};
        utils.sendSuccessResponse(res, happen);
      }
      else{
        var happen = {happening: false};
        res.render('hostPreEvent', {_event: _event})
      }
    });
  });
});

/* GET guest waiting page. */
router.get('/waiting', function(req, res, next) {
  var tarOrder = Order.getOrder(req.eventID)
  if (tarOrder.status == 0){
    res.render('waitPage');
  }
  else{
    return false;
  }
});

/* GET guest notification page. */
router.get('/notify', function(req, res, next) {
  var tarOrder = Order.getOrder(req.eventID)
  if (tarOrder.status == 1){
  	res.render('notifyPage');
  }
  else{
  	return false;
  }
});

function isLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();	
	}
	res.redirect('/dashboard');
}

module.exports = router;

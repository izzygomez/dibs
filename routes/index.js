var express = require('express');
var router = express.Router();
var Event = require('../models/Event');
var Order = require('../models/Order');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index');
});

/* GET guestPreEvent page. */
router.get('/guestPreEvent', function(req, res, next) {
  var tarEvent = Event.getEvent(req.eventID)
  if (tarEvent.isHappening()){  
  	res.render('guestPreEvent');
  }
  else{
  	return false;
  }
});

/* GET hostPreEvent page. */
router.get('/hostPreEvent', function(req, res, next) {
  var tarEvent = Event.getEvent(req.eventID)
  if (tarEvent.isHappening()){  
  	res.render('hostPreEvent');
  }
  else{
  	return false;
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
});

function isLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();	
	}
	res.redirect('/dashboard');
}

module.exports = router;

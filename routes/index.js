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

/* GET guest waiting page */
router.get('/waiting', function(req, res) {
  res.render('waitPage');
});

/* GET guest notification page */
router.get('/notify', function(req, res) {
  res.render('notifyPage');
});


function isLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();	
	}
	res.redirect('/dashboard');
}

module.exports = router;

//Main Author: Daniel Lerner

var express = require('express');
var router = express.Router();
var Event = require('../models/Event');
var Menu = require('../models/Menu');
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
        var data = {happening: true};
        utils.sendSuccessResponse(res, data);
      }
      else{
        Menu.getMenu(_event._id, function(menu){
          var data = {happening: false, _event: _event, menu: menu};
          utils.sendSuccessResponse(res, data);
        });
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

/* GET guest notification page */
router.get('/suggestions', function(req, res) {
  res.render('hostSuggestions', {_event: req.query.eventData._event, menu: req.query.eventData.menu});
});


function isLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();	
	}
	res.redirect('/dashboard');
}

module.exports = router;

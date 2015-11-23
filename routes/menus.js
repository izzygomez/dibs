// Main Author: Daniel Lerner

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Menu = require('../models/Menu');
var User = require('../models/User')

// Gets menu and name of an event to populate menu.ejs file 
router.get('/', function(req, res) {	
  var menu;
  var eventName;
  User.getEvent(req.menuID, function(result){
  	eventName = result._title
  })

  Menu.getMenu(req.menuID, function(result){
    menu = result;
    res.render('menu', {eventName: eventName, menu: menu}); 
  })
});






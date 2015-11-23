// Main Author: Daniel Lerner

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Menu = require('../models/Menu');

router.get('/', function(req, res) {	
  var menu;
  Menu.getMenu(req.menuID, function(result)
  {
    menu = result;
    res.render('menu', {eventName: 'Event Name', menu: menu}); 
  })
});






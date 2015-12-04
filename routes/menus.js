// Main Author: Daniel Lerner

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Menu = require('../models/Menu');
var Event = require('../models/Event');

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

router.post('/removeDrink', function(req, res) {
	Menu.removeDrink(req.body.menuID, req.body.drink, function(err) {
		if (err) {
			utils.sendErrResponse(res, 500, 'Unable to remove drink: ' + req.body.drink);
		} 
		else {
			Event.findByID(req.body.menuID, function(err, _event){
				Menu.getMenu(req.body.menuID, function(menu){
					var eventData = {_event: _event, menu: menu};
					utils.sendSuccessResponse(res, eventData);
				});
			});
		}
	});
});

router.post('/addDrink', function(req, res) {
	Menu.addDrinkOrder(req.body.menuID, {drink: req.body.drink, stock: req.body.stock}, function(err) {
		if (err) {
			utils.sendErrResponse(res, 500, 'Drink cannot be added');
		} else {
			Event.findByID(req.body.menuID, function(err, _event) {
				Menu.getMenu(req.body.menuID, function(menu) {
					var eventData = {_event: _event, menu: menu};
					utils.sendSuccessResponse(res, eventData);
				});
			});
		}
	});
});

router.post('/updatePreStock', function(req, res) {
	var stock = req.body.stock;
	var menuID = req.body.menuID;
	var drink = req.body.drink;
	Menu.updatePreStock(menuID, drink, stock, function(err) {
		if (err) {
			utils.sendErrResponse(res, 500, 'Unable to update drink stock: ' + drink);
		} 
		if (isNaN(stock)){
			utils.sendErrResponse(res, 400, 'Invalid stock input')
		}
		else {
			Event.findByID(menuID, function(err, _event){
				Menu.getMenu(menuID, function(menu){
					var eventData = {_event: _event, menu: menu};
					utils.sendSuccessResponse(res, eventData);
					});
				});
		}
	});
});

module.exports = router;




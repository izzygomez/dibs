// Main Author: Daniel Lerner

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Menu = require('../models/Menu');
var Event = require('../models/Event');

/*
  POST /menus/removeDrink
  Request body:
  - menuID: id of Menu object
  - drink: name of drink to remove
  Response:
    - success: true if the server succeeded in removing drink from desired menu
    - content: on success, pass back updated menu for specified event
    - err: on failure, an error message noting unable to remove drink
*/
router.post('/removeDrink', function(req, res) {
	Menu.removeDrink(req.body.menuID, req.body.drink, function(err) {
		if (err) {
			utils.sendErrResponse(res, 500, 'Unable to remove drink: ' + req.body.drink);
		} 
		else {
			Event.findByID(req.body.menuID, function(err, _event){
				Menu.getMenu(req.body.menuID, function(menu){
					Event.isHappening(req.body.menuID, function(err, happening){
						var eventData = {_event: _event, menu: menu, happening: happening};
						utils.sendSuccessResponse(res, eventData);
					});
				});
			});
		}
	});
});

/*
  POST /menus/addDrink
  Request body:
  - menuID: id of Menu object
  - drink: name of drink to add to menu
  Response:
    - success: true if the server succeeded in adding drink to desired menu
    - content: on success, pass back updated menu for specified event
    - err: on failure, an error message noting unable to add drink to menu
*/
router.post('/addDrink', function(req, res) {
	Menu.addDrinkOrder(req.body.menuID, {drink: req.body.drink, stock: req.body.stock}, function(err) {
		if (err) {
			console.log(err);
			utils.sendErrResponse(res, 500, err.msg);
		} 
		else {
			Event.findByID(req.body.menuID, function(err, _event) {
				Menu.getMenu(req.body.menuID, function(menu) {
					Event.isHappening(req.body.menuID, function(err, happening){
						var eventData = {_event: _event, menu: menu, happening: happening};
						utils.sendSuccessResponse(res, eventData);
					})
				});
			});
		}
	});
});

/*
  POST /menus/updatePreStock
  Request body:
  - menuID: id of Menu object
  - drink: name of drink to remove
  - stock: stock of drink to update menu of
  Response:
    - success: true if the server succeeded in updating drink stock from desired menu
    - content: on success, pass back updated menu for specified event
    - err: on failure, an error message noting either unable to update drink stock or 
    // an invalid stock input was entered
*/
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
					Event.isHappening(req.body.menuID, function(err, happening){
						var eventData = {_event: _event, menu: menu, happening: happening};
						utils.sendSuccessResponse(res, eventData);
					});
				});
			});
		}
	});
});

/*
  POST /menus/setDrinkLimit
  Request body:
  - eventID: id of Event to set drink limit of
  - limit: numerical value to set limit for event of
  Response:
    - success: true if the server succeeded in setting drink limit for event
    - content: on success, pass back updated event data for specified event
    - err: on failure, an error message noting unable to set limit for event or input drink limit was invalid
*/
router.post('/setDrinkLimit', function(req, res) {
	if (!isNaN(req.body.limit)) {
		Event.setLimit(req.body.eventID, req.body.limit, function(err) {
			if (err) {
				utils.sendErrResponse(res, 500, 'An unknown error occurred.');
			} else {
				Event.findByID(req.body.eventID, function(err, _event) {
					Menu.getMenu(req.body.eventID, function(menu) {
						Event.isHappening(req.body.eventID, function(err, happening) {
							var eventData = {_event: _event, menu: menu, happening: happening};
							utils.sendSuccessResponse(res, eventData);
						});
					});
				});
			}
		});
	} else {
		utils.sendErrResponse(res, 400, 'Must input a number.');
	}
});
module.exports = router;




// Main author: Brian Saavedra

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Event = require('../models/Event');
var User = require('../models/User');
var Menu = require('../models/Menu');
var Queue = require('../models/Queue');
var Order = require('../models/Order');
var FB = require('fb');

/* 
	POST /events/menu
	Request query: 
		- menuID: ID of desired menu
	Request user:
		- _id: id of user currently logged into Dibs
	Response:
		- success: True if the server succeeded in gathering data for menus.ejs
		- success: renders menus.ejs file for guest to see information regarding event
*/
router.get('/menu', function(req, res){
	Event.findByID(req.query.menuID, function(err, _event){
		var currentGuest = _event.guests.filter(function(guest) {
			return guest.user === req.user._id;
		});
		Menu.getMenuDrinks(req.query.menuID, function(drinks){
			if(drinks){
				Queue.getEventOrders(req.query.menuID, function(orders) {
					var myOrders = [];
					if (orders.length !== 0) {
						orders.forEach(function(orderID, i) {
							Order.getOrder(orderID, function(order) {
								if (order.from === req.user._id && order._status != 2) {
									var status = "not set";
									switch(order._status) {
										case 0:
											status = "Queued";
											break;
										case 1:
											status = "Ready!";
											break;
										default: 
											status = "Status Error";
									}
									myOrders.push({ordered: order.drink, _status: status});
									if (i === orders.length-1) {
										var showMenu = currentGuest[0].drinksOrdered < _event.drinkLimit;
										res.render('menu', {eventName: _event._title, menu_id: req.query.menuID, 
															drinks: drinks, orders: myOrders, showMenu: showMenu});
									}
								}
							});
						});
					} else {
						res.render('menu', {eventName: _event._title, menu_id: req.query.menuID, drinks: drinks, orders: myOrders});
					}
				});
			}
		});
   	});
});

/* 
	POST /events
	Request body:
		- content: An event
	Response:
		- success: True if the server succeeded in registering the event
		- err: On failure, an error message
*/
router.post('/', function(req, res){
	var eventID = req.body.eventID;
	User.getToken(req.user._id, function(err, token){
		FB.setAccessToken(token);
		FB.api('/' + eventID + '?fields=name, start_time, end_time, admins, attending', function(response){
			if (response && !response.error){
				var guests = response.attending.data.map(function(attendee) {
					return attendee.id;
				});
				var hosts = response.admins.data.map(function(admin) {
					return admin.id;
				});
				var newGuests = guests.filter(function(attendee) {
					return hosts.indexOf(attendee) === -1;
				});
				Event.createNewEvent(eventID, response.name, response.start_time, response.end_time, newGuests, hosts, 3, function(err){
					if (err){
						utils.sendErrResponse(res, 500, 'The event already exists');
					} else{
						utils.sendSuccessResponse(res);
					}
				});
			} else {
				utils.sendErrResponse(res, 500, 'Unable to register event');
			}
		});
	});
});

/*
  POST /events/suggest
  Request body:
  - eventID: id of event to check/modify suggestions of
  - suggestion1: name of suggestion submitted
  Response:
    - success: true if the server succeeded in adding suggestion to an event
    - err: on failure, an error message noting a user is out of suggestions
*/
router.post('/suggest', function(req, res) {
	Event.checkSuggestionLimit(req.user._id, req.body.eventID, function(result){
		if (result){
			Event.decreaseSuggestionCount(req.user._id, req.body.eventID, function(result){
				Event.addSuggestion(req.body.eventID, req.body.suggestion1, function(err){
					if (err === null) {
						utils.sendSuccessResponse(res);
					}
				});
			})
		}
		else{
			utils.sendErrResponse(res, 500, 'You are already out of suggestions!');
		}
	});
});

module.exports = router;
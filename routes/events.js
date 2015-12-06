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

// ***************************************
// The event routes go here.
// ***************************************

// METHOD SPEC NEEDED -- renders display of menu for guest at event happening now
router.get('/menu', function(req, res){
	Event.findByID(req.query.menuID, function(err, _event){
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
										res.render('menu', {eventName: _event._title, menu_id: req.query.menuID, drinks: drinks, orders: myOrders});
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

// TODO: Possibly not in this file, but somewhere, write routes that will fetch the events 
// a user is going to that are not registered with dibs. 

/* 
	POST /events
	Request body:
		- content: An event
	Response:
		- success: True if the server succeeded in registering the event
		- err: On failure, an error message
*/
router.post('/', function(req, res){
	// TODO: Get all the information needed to create the event using the FB API
	// TODO: Set the drink limit for a specific event, which for the MVP, will be
	// 		 a fixed number.
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
				console.log(response.error);
			}
		});
	});
});

router.post('/suggest', function(req, res) {
	Event.addSuggestion(req.body.eventID, req.body.suggestion1, function(err){
		if (err === null) {
			Event.addSuggestion(req.body.eventID, req.body.suggestion2, function(err2){
				if (err2 === null) {
					Event.addSuggestion(req.body.eventID, req.body.suggestion3, function(err3){
						if (err3 === null) {
							utils.sendSuccessResponse(res);
						}
					});				
				}
			});
		}
	});
});

module.exports = router;
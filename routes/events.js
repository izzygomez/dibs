// Main author: Brian Saavedra

var express = require('express');
var router = express.Router();

var utils = require('../utils/utils');

var Event = require('../models/Event');
var User = require('../models/User');
var FB = require('fb');

// ***************************************
// The event routes go here.
// ***************************************

/* 
	GET /registeredHostEvents
	No request parameters
	Response: 
		- success: True if the server succeeded in getting the user's dibs 
				   registered events they are hosting
		- content: On success, an object with one field: hostRegisteredEvents, 
				   hosted events that are registered, in the form of a list.
		- err: On failure, an error message
*/
router.get('/registeredHostEvents', function(req, res){
	// TODO: Get the UserID for the following function
	User.getEventsHosting(userID, function(err, hostRegisteredEvents){
		if (err){
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else{
			utils.sendSuccessResponse(res, {hostRegisteredEvents: hostRegisteredEvents});
		}
	});
});

/*
	GET /registeredAttendEvents
	No request parameters
	Response:
		- success: True if the server succeeded in getting the user's dibs 
				   registered events they are attending.
		- content: On success, an object with one field: attendRegisteredEvents,
				   attending events that are registered, in the form of a list.
		- err: On failure, an error message
*/
router.get('/registeredAttendEvents', function(req, res){
	// TODO: Get the UserID for the following function
	User.getEventsAttending(userID, function(err, attendRegisteredEvents){
		if (err){
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else{
			utils.sendSuccessResponse(res, {attendRegisteredEvents: attendRegisteredEvents});
		}
	});
});

// METHOD SPEC NEEDED -- renders display of menu for guest at event happening now
router.get('/menu', function(req, res){
	Event.findByID(req.query.menuID, function(err, _event){
		console.log("rendering menu");
		res.render('menu', {_event: _event, menu: _event.menu})
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
				var attending = response.attending.data;
				var guests = attending.filter(function(attendee) {
					return response.admins.data.indexOf(attendee) != -1;
				});
				var guestIDs = guests.map(function(guest) {
					return guest.id;
				})
				var hosts = response.admins.data.map(function(admin) {
					return admin.id;
				});
				Event.createNewEvent(eventID, response.name, response.start_time, response.end_time, guests, hosts, 3, function(err){
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

module.exports = router;
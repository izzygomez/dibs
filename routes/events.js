// Main author: Brian Saavedra

var express = require('express');
var router = express.Router();

var utils = require('../utils/utils');

var Event = require('../models/Event');
var User = require('../models/User');

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
	Event.createNewEvent(eventID, title, start, end, guests, hosts, limit, function(err){
		if (err){
			utils.sendErrResponse(res, 500, 'The event already exists');
		} else{
			utils.sendSuccessResponse(res);
		}
	});
});


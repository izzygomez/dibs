// Main author: Brian Saavedra

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Event = require('../models/Event');
var User = require('../models/User');
var Menu = require('../models/Menu');
var FB = require('fb');

// ***************************************
// The event routes go here.
// ***************************************

// METHOD SPEC NEEDED -- renders display of menu for guest at event happening now
router.get('/menu', function(req, res){
	Event.findByID(req.query.menuID, function(err, _event){
		Menu.getMenuDrinks(req.query.menuID, function(drinks){
			if(drinks){
				res.render('menu', {eventName: _event._title, menu_id: req.query.menuID, drinks: drinks});
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
	Event.checkSuggestionLimit(req.user._id, req.body.eventID, function(result){
		console.log("able to suggest?");
		console.log(result);
		if (result){
			console.log("decreaseSuggestionCount");
			Event.decreaseSuggestionCount(req.user._id, req.body.eventID, function(result){
				console.log("decreased suggestion count?");
				console.log(result)
				Event.addSuggestion(req.body.eventID, req.body.suggestion1, function(err){
					console.log("adding suggestion")
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
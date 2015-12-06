var express = require('express');
var router = express.Router();
var Event = require('../models/Event.js');
var User = require('../models/User.js');
var FB = require('fb');

/*
  GET /facebook/events
*/
router.get('/events', isLoggedIn, function (req, res) {
	User.getToken(req.user._id, function(err, token){
		FB.setAccessToken(token);
		FB.api('/me/events?fields=name,start_time,end_time,is_viewer_admin,title', function(response){
			if (response && !response.error){
				// Get user events
				var userEvents = response.data;

				var filteredUserEvents = [];

				var rightNow = Date.now(); // in ms since Jan 1, 1970 00:00:00 UTC

				userEvents.forEach(function (currentEvent, i, userEvents) {
					if (currentEvent.end_time) {
						var currEventDate = Date.parse(currentEvent.end_time.substring(0,19));
						var offsetString = currentEvent.end_time.substring(20);
						var offset = (offsetString.substring(0,2) + offsetString.substring(2)/60.0) * 3600000; // 3600000 = ms in an hour
						if (currentEvent.end_time.substring(19,20) === '+') {
							currEventDate = currEventDate - offset;
						} else { // '-'
							currEventDate = currEventDate + offset;
						}
					} else {
						var currEventDate = Date.parse(currentEvent.start_time.substring(0,19)) + 18000000; // adding 5 hours (18000000 ms)
						var offsetString = currentEvent.start_time.substring(20);
						var offset = (offsetString.substring(0,2) + offsetString.substring(2)/60.0) * 3600000; // 3600000 = ms in an hour
						if (currentEvent.start_time.substring(19,20) === '+') {
							currEventDate = currEventDate - offset;
						} else { // '-'
							currEventDate = currEventDate + offset;
						}
					}

					if (currEventDate - rightNow >= 0) {
						filteredUserEvents.push(currentEvent)
					}
				});

				userEvents = filteredUserEvents;

				var separatedEvents = {hostNotRegisteredEvents: [], hostRegisteredEvents: [],
									   attendingNotRegisteredEvents: [], attendingRegisteredEvents: []};

				userEvents.forEach(function(currentEvent, i, userEvents){
					Event.eventExists(currentEvent.id, function(bool){
						if (bool){
							// Separate the guests and the hosts of the events if the event is already registered with the app.
							var guests = currentEvent.attending.map(function(attendee) {
								return attendee.id;
							});
							var hosts = response.admins.map(function(admin) {
								return admin.id;
							});
							var newGuests = guests.filter(function(attendee) {
								return hosts.indexOf(attendee) === -1;
							});
							// Update the event in the database everytime this FB api call is made.
							Event.updateEvent(currentEvent.id, currentEvent.name, currentEvent.start_time, 
							currentEvent.end_time, newGuests, hosts, function(err){
								if (err){
									utils.sendErrResponse(null, 500, 'There was an error in the modification of this event');
								} else{
									utils.sendSuccessResponse(null);
								}
							});
						}
						// Check to see what type of event it is.
						if (currentEvent.is_viewer_admin && bool){
							separatedEvents.hostRegisteredEvents.push(currentEvent);
						} else if (currentEvent.is_viewer_admin && !bool){
							separatedEvents.hostNotRegisteredEvents.push(currentEvent);
						} else if (!currentEvent.is_viewer_admin && bool){
							separatedEvents.attendingRegisteredEvents.push(currentEvent);
						} else if (!currentEvent.is_viewer_admin && !bool){
							separatedEvents.attendingNotRegisteredEvents.push(currentEvent);
						} else {
						}
						if (userEvents.length === separatedEvents.hostNotRegisteredEvents.length + 
												separatedEvents.hostRegisteredEvents.length + 
												separatedEvents.attendingNotRegisteredEvents.length +
												separatedEvents.attendingRegisteredEvents.length){
							res.render('allEvents', separatedEvents);
						}
					});
				});

				if (userEvents.length === 0) {
					res.render('noEvents');
				}
			} else {
				console.log("Error with the Facebook API. Rekt!");
			}
		});
	});
		
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}

module.exports = router;  
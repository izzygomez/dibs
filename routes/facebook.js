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
		FB.api('/me/events?fields=name,start_time,is_viewer_admin, title', function(response){
			if (response && !response.error){
				// Get user events
				var userEvents = response.data;
				var separatedEvents = {hostNotRegisteredEvents: [], hostRegisteredEvents: [],
									   attendingNotRegisteredEvents: [], attendingRegisteredEvents: []};
				userEvents.forEach(function(currentEvent, i, userEvents){
					// Check to see what type of event it is.
					Event.eventExists(currentEvent.id, function(bool){
						if (currentEvent.is_viewer_admin && bool){
							separatedEvents.hostRegisteredEvents.push(currentEvent);
						} else if (currentEvent.is_viewer_admin && !bool){
							separatedEvents.hostNotRegisteredEvents.push(currentEvent);
						} else if (!currentEvent.is_viewer_admin && bool){
							separatedEvents.attendingRegisteredEvents.push(currentEvent);
						} else if (!currentEvent.is_viewer_admin && !bool){
							separatedEvents.attendingNotRegisteredEvents.push(currentEvent);
						} else {
							console.log('Error!');
						}
						if (i === userEvents.length -1){
							res.render('allEvents', separatedEvents);
						}
					});
				});
			} else {
				console.log("Error!");
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
var express = require('express');
var router = express.Router();
var Event = require('../models/Event.js');

/*
  GET /facebook/events
*/
router.get('/events', isLoggedIn, function (req, res) {
	FB.api('/me/events', function(response){
		if (response && !response.error){
			// Get user events
			var userEvents = response.data;
			var separatedEvents = {hostNotRegisteredEvents: [], hostRegisteredEvents: [],
								   attendingNotRegisteredEvents: [], attendingRegisteredEvents: []};
			userEvents.forEach(function(currentEvent){
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
				});
			});
			res.render('allEvents', separatedEvents);
		} else {
			console.log("Error!");
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}

module.exports = router;  
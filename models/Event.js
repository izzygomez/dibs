// Main author: Sara Stiklickas

var mongoose = require('mongoose');
var Menu = require('./Menu');
var Queue = require('./Queue');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	_id: Number,
	hosts: [{type: Number, ref: 'User'}],
	drinkLimit: Number,
	guests: [{user: {type: Number, ref: 'User'}, drinksOrdered: Number, suggestions: Number}],
	suggestions: [{drink:String, count: Number}],
	menu: {type: Number, ref: 'Menu'},
	queue: {type: Number, ref: 'Queue'},
	_title: String, 
	startTime: Date,
	endTime: Date
});

/* 
Checks if an event exists in the database
params: 
	eventID: the ID of the event to check
returns: 
	boolean value indicating whether the event exists
*/
eventSchema.statics.eventExists = function(eventID, callback) {
	var exists = null;
	Event.findOne({_id: eventID}, function(err, thisEvent) {
		if (err) {
			console.log(err);
		}
		if (thisEvent === null) {
			exists = false;
		} else {
			exists = true;
		}
		callback(exists);
	});
}

/*
Gets an event from the database
params: 
	eventID: the ID of the event to get
returns:
	the event with the given ID, or an error if the ID is invalid
*/
var getEvent = function(eventID, callback) {
	var thisEvent = null;
	Event.eventExists(eventID, function(exists) {
		if (exists) {
			Event.findOne({_id: eventID}, function(err, found) {
				if (found === null) {
					thisEvent = null;
				} else {
					thisEvent = found; 
				}
				callback(thisEvent);
			});
		} else {
			callback({msg: 'Invalid event.'});
		}
	});
}

/*
Gets an event given the eventID
params: 
	eventID: the ID of the event to find
returns: 
	an error if one occurred, and the event that was found
*/
eventSchema.statics.findByID = function(eventID, callback) {
	getEvent(eventID, function(thisEvent) {
		callback(null, thisEvent);
	});
}

/*
Creates a new event and adds it to the database.
params: 
	eventID: the ID of the event to add
	title: the title of the event
	start: the time the event starts (javascript Date)
	end: the time the event ends (javascript Date)
	guests: a list of guest IDs
	hosts: a list of host IDs
	limit: the per-person drink limit of the event 
*/
eventSchema.statics.createNewEvent = function(eventID, title, start, end, guests, hosts, limit, callback) {
	Event.eventExists(eventID, function(exists) {
		if (exists) {
			callback({taken: true});
		} else {
			Menu.createMenu(eventID, function(err){
				if (err) {
					console.log(err);
				}
			});
			Queue.createQueue(eventID, function(err){
				if (err) {
					console.log(err);
				}
			});
			var newGuests = guests.map(function(guest){
				return {user: guest, drinksOrdered: 0, suggestions: 3};
			});
			var data = {_id: eventID,
						hosts: hosts,
						drinkLimit: limit,
						guests: newGuests,
						suggestions: [],
						menu: eventID,
						queue: eventID,
						_title: title,
						startTime: start,
						endTime: end};
			Event.create(data);
			callback(null);
		}
	});
}

/*
Adds a suggestion made by a guest to the database
params: 
	eventID: the ID of the event to get the suggestion
	suggestion: a String representing the drink suggested
*/
eventSchema.statics.addSuggestion = function(eventID, suggestion, callback){
	Event.getSuggestions(eventID, function(err, suggestions){
		var count = suggestions.length;
		var lowerSuggestion = suggestion.toLowerCase();
		var drinks = suggestions.map(function(suggest){
			return suggest.drink;
		});
		if (drinks.indexOf(suggestion) === -1) {
			suggestions.push({drink: suggestion, count: 1});
			Event.update({_id: eventID}, {$set: {suggestions: suggestions}}, function(){});
			callback(null);
		} else {
			var updated = suggestions.map(function(suggest) {
				if (lowerSuggestion === suggest.drink) {
					return {drink: lowerSuggestion, count: suggest.count + 1};
				} else {
					return suggest;
				}
			});
			Event.update({_id: eventID}, {$set: {suggestions: updated}}, function(){});
			callback(null);
		}
	});
}

/*
Checks if an event is currently happening
params:
	eventID: the ID of the event to check
returns:
	an error if one occurs, and the boolean indicating whether the event is happening
*/
eventSchema.statics.isHappening = function(eventID, callback){
	var now = Date.now();
	getEvent(eventID, function(thisEvent) {
		if (thisEvent.startTime <= now && thisEvent.endTime > now) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	});
}

/*
Gets the drink suggestions for an event
params:
	eventID: the ID of the event to get suggestions from
returns: 
	an error if one occurs, and the list of suggestions of the form {drink, count}
*/
eventSchema.statics.getSuggestions = function(eventID, callback) {
	getEvent(eventID, function(thisEvent) {
		var suggests = thisEvent.suggestions; 
		callback(null, suggests);
	});
}

/*
Checks whether a guest has reached the drink limit
params: 
	userID: the ID of the user whose limit will be checked
	eventID: the ID of the event where it will check
returns:
	boolean that is true if the guest has reached the drink limit, else false
*/
eventSchema.statics.checkLimit = function(userID, eventID, callback) {
	getEvent(eventID, function(thisEvent) {
		thisEvent.guests.forEach(function(guestObject) {
			if (guestObject.user === userID) {
				callback(guestObject.drinksOrdered === thisEvent.drinkLimit);
			}
		});
	});
}

/*
Checks whether a guest has reached the suggestion limit
params: 
	userID: the ID of the user whose suggestion limit will be checked
	eventID: the ID of the event where it will check
returns: 
	boolean that is true if suggestions limit has not been reached, else false
*/
eventSchema.statics.checkSuggestionLimit = function(userID, eventID, callback) {
	getEvent(eventID, function(thisEvent) {
		thisEvent.guests.forEach(function(guestObject) {
			if (guestObject.user === userID) {
				callback(guestObject.suggestions > 0);
			}
		});
	});
}

/*
Decreases the number of suggestions left for a guest to make
params:
	userID: the ID of the user with the count to decrease
	eventID: the ID of the event with the count to decrease
*/
eventSchema.statics.decreaseSuggestionCount = function(userID, eventID, callback) {
	getEvent(eventID, function(thisEvent) {
		var newGuestList = thisEvent.guests.map(function(guestObject) {
			if (guestObject.user === userID) {
				if (guestObject.suggestions > 0){
					return {user: guestObject.user, drinksOrdered: guestObject.drinksOrdered, suggestions: guestObject.suggestions - 1};
				}
			}
			else{
					return guestObject;
				} 
		});
		Event.update({_id: eventID}, {$set: {guests: newGuestList}}, function() {
			callback(null);
		});
	});
}

/*
Adds a drink to the number of drinks ordered by a guest
params:
	userID: the ID of the user who ordered a drink
	eventID: the ID of the event where they ordered a drink
*/
eventSchema.statics.decreaseLimit = function(userID, eventID, callback) {
	getEvent(eventID, function(thisEvent) {
		var newGuestList = thisEvent.guests.map(function(guestObject) {
			if (guestObject.user === userID) {
				return {user: guestObject.user, drinksOrdered: guestObject.drinksOrdered + 1};
			} else {
				return guestObject;
			}
		});
		Event.update({_id: eventID}, {$set: {guests: newGuestList}}, function() {
			callback(null);
		});
	});
}

/* 
Change some of the information regarding the event, so that the event's information is updated to
what is on Facebook
params:
	eventID: the ID of the event to update
	newTitle: the new title for the event
	newStart: the new start time for the event
	newEnd: the new end time for the event
	newGuests: the new list of guest IDs for the event
	newHosts: the new list of host IDs for the event
*/
eventSchema.statics.updateEvent = function(eventID, newTitle, newStart, newEnd, newGuests, newHosts, callback){
	getEvent(eventID, function(thisEvent) {
		Event.update({_id: eventID}, {$set: {_title: newTitle, startTime: newStart, endTime: newEnd, hosts: newHosts, 
		guests: newGuests}}, function(){
			callback(null)
		});
	});
}

/*
Sets the individual drink limit (drinks allowed per guest) for an event
params: 
	eventID: the ID of the event getting the new limit
	newLimit: the new drink limit that is being set
*/
eventSchema.statics.setLimit = function(eventID, newLimit, callback) {
	getEvent(eventID, function(thisEvent) {
		Event.update({_id: eventID}, {drinkLimit: newLimit}, function() {
			callback(null);
		});
	});
}

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
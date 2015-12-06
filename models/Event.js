// Main author: Sara Stiklickas

// grab the things that we need
var mongoose = require('mongoose');
var Menu = require('./Menu');
var Queue = require('./Queue');

var Schema = mongoose.Schema;

// create a schema
var eventSchema = new Schema({
	_id: Number,
	hosts: [{type: Number, ref: 'User'}],
	drinkLimit: Number,
	guests: [{user: {type: Number, ref: 'User'}, drinksOrdered: Number}],
	suggestions: [{drink:String, count: Number}],
	menu: {type: Number, ref: 'Menu'},
	queue: {type: Number, ref: 'Queue'},
	_title: String, 
	startTime: Date,
	endTime: Date
});

/* 
Checks if an event exists in the database
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
*/
eventSchema.statics.findByID = function(eventID, callback) {
	getEvent(eventID, function(thisEvent) {
		callback(null, thisEvent);
	});
}

/*
Creates a new event and adds it to the database.
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
				return {user: guest, drinksOrdered: 0};
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
*/
eventSchema.statics.getSuggestions = function(eventID, callback) {
	getEvent(eventID, function(thisEvent) {
		var suggests = thisEvent.suggestions; 
		callback(null, suggests);
	});
}

eventSchema.statics.checkLimit = function(userID, eventID, callback) {
	getEvent(eventID, function(thisEvent) {
		thisEvent.guests.forEach(function(guestObject) {
			if (guestObject.user === userID) {
				callback(guestObject.drinksOrdered === thisEvent.drinkLimit);
			}
		});
	});
}

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
*/
eventSchema.statics.updateEvent = function(eventID, newTitle, newStart, newEnd, newGuests, newHosts, callback){
	getEvent(eventID, function(thisEvent) {
		Event.update({_id: eventID}, {$set: {_title: newTitle, startTime: newStart, endTime: newEnd, hosts: newHosts, 
		guests: newGuests}}, function(){
			callback(null);
		});
	});
}

eventSchema.statics.setLimit = function(eventID, newLimit, callback) {
	getEvent(eventID, function(thisEvent) {
		Event.update({_id: eventID}, {drinkLimit: newLimit}, function() {
			callback(null);
		});
	});
}

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
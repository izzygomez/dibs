// Main author: Sara Stiklickas

// grab the things that we need
var mongoose = require('mongoose');
var Menu = require('Menu');
var Queue = require('Queue');

var Schema = mongoose.Schema;

// create a schema
var eventSchema = new Schema({
	_id: Number,
	hosts: [{type: Number, ref: 'User'}],
	drinkLimit: Number,
	guests: [{type: Number, ref: 'User'}],
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
			var data = {_id: eventID,
						hosts: hosts,
						drinkLimit: limit,
						guests: guests,
						menu: newMenu,
						queue: newQueue,
						_title: title,
						startTime: start,
						endTime: end};
			Event.create(data);
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
	})
}

/*
Gets the menu for an event
*/
eventSchema.statics.getMenu = function(eventID, callback){
	getEvent(eventID, function(thisEvent) {
		var menu = thisEvent.menu;
		callback(null, menu);
	});
}

/*
Gets the queue for an event
*/
eventSchema.statics.getQueue = function(eventID, callback){
	getEvent(eventID, function(thisEvent) {
		var queue = thisEvent.queue;
		callback(null, queue);
	});
}

/*
Gets the guests of an event
*/
eventSchema.statics.getGuests = function(eventID, callback){
	getEvent(eventID, function(thisEvent) {
		var guests = thisEvent.guests;
		callback(null, guests);
	});
}

/*
Gets the hosts of an event
*/
eventSchema.statics.getHosts = function(eventID, callback){
	getEvent(eventID, function(thisEvent) {
		var hosts = thisEvent.hosts; 
		callback(null, hosts);
	});
}

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var eventSchema = new Schema({
	_id: Number,
	host: {type: Number, ref: 'User'},
	drinkLimit: Number,
	guests: [{type: Number, ref: 'User'}],
	menu: {type: Number, ref: 'Menu'},
	queue: {type: Number, ref: 'Queue'},
	title: String, 
	startTime: Date,
	endTime: Date
});

// TODO create private and public methods
// e.g. "var f = function (...) {...}" is private;
//      "[schema].statics.f = function (...) {...}" is public

/* 
Checks if an event exists in the database
*/
var eventExists = function(eventName, callback) {
	var exists = null;
	Event.findOne({title: eventName}, function(err, thisEvent) {
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
var getEvent = function(eventName, callback) {
	var thisEvent = null;
	eventExists(eventName, function(exists) {
		if (exists) {
			Event.findOne({title: eventName}, function(err, found) {
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
Gets an event given the title
*/
eventSchema.statics.findByTitle = function(title, callback) {
	getEvent(title, function(thisEvent) {
		if (exists) {
			callback(null, thisEvent);
		} else {
			callback({msg: 'Event does not exist or is not registered'});
		}
	});
}

/*
Creates a new event and adds it to the database.
*/
eventSchema.statics.createNewEvent = function(title, start, end, guests, host, limit, callback) {}

/*
Checks if an event is currently happening
*/
eventSchema.statics.isHappening = function(title, callback){}

/*
Gets the menu for an event
*/
eventSchema.statics.getMenu = function(title, callback){
	getEvent(title, function(thisEvent) {
		var menu = thisEvent.menu;
		callback(null, menu);
	});
}

/*
Gets the queue for an event
*/
eventSchema.statics.getQueue = function(title, callback){
	getEvent(title, function(thisEvent) {
		var queue = thisEvent.queue;
		callback(null, queue);
	});
}

/*
Gets the guests of an event
*/
eventSchema.statics.getGuests = function(title, callback){
	getEvent(title, function(thisEvent) {
		var guests = thisEvent.guests;
		callback(null, guests);
	});
}

/*
Gets the host of an event
*/
eventSchema.statics.getHost = function(title, callback){}

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
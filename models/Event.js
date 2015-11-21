// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var eventSchema = new Schema({
	_id: Number,
	hosts: [{type: Number, ref: 'User'}],
	drinkLimit: Number,
	guests: [{type: Number, ref: 'User'}],
	menu: {type: Number, ref: 'Menu'},
	queue: {type: Number, ref: 'Queue'},
	title: String, 
	startTime: Date,
	endTime: Date
});

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
		callback(null, thisEvent);
	});
}

/*
Creates a new event and adds it to the database.
*/
eventSchema.statics.createNewEvent = function(eventID, title, start, end, guests, hosts, limit, callback) {
	eventExists(title, function(exists) {
		if (exists) {
			callback({taken: true});
		} else {
			var data = {_id: eventID,
						hosts: hosts,
						drinkLimit: limit,
						guests: guests,
						menu: [], //NEED METHODS FOR CREATING QUEUE AND MENU
						queue: [],
						title: title,
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
eventSchema.statics.isHappening = function(title, callback){
	var now = Date.now();
	getEvent(title, function(thisEvent) {
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
Gets the hosts of an event
*/
eventSchema.statics.getHosts = function(title, callback){
	getEvent(title, function(thisEvent) {
		var hosts = thisEvent.hosts; 
		callback(null, hosts);
	});
}

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
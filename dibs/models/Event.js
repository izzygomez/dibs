// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var eventSchema = new Schema({
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
Checks if an event exists and is registered with dibs
*/
var checkIfRegistered = function(eventName, callback) {
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
	})
	// STILL HAVE TO CHECK IF REGISTERED
}

/*
Gets an event from the database
*/
var getEvent = function(eventName, callback) {
	var thisEvent = null;
	checkIfRegistered(eventName, function(exists) {
		if (exists) {
			Event.findOne({title: eventName}, function(err, found) {
				if (found === null) {
					thisEvent = null;
				} else {
					thisEvent = found; 
				}
				callback(thisEvent);
			})
		}
	})
}

/*
Gets an event given the title
*/
eventSchema.statics.findByTitle = function(title, callback) {}

/*
Creates a new event and adds it to the database.
*/
eventSchema.statics.createNewEvent = function(title, callback) {}

/*
Checks if an event is currently happening
*/
eventSchema.statics.isHappening = function(title, callback){}

/*
Gets the menu for an event
*/
eventSchema.statics.getMenu = function(title, callback){}

/*
Gets the queue for an event
*/
eventSchema.statics.getQueue = function(title, callback){}

/*
Gets the guests of an event
*/
eventSchema.statics.getGuests = function(title, callback){}

/*
Gets the host of an event
*/
eventSchema.statics.getHost = function(title, callback){}

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
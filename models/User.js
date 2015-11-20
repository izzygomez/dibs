// Main author: Brian Saavedra

// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
	_id: Number,					// Will be the Facebook ID assigned to the user
	facebookCredentials = String,	// Facebook Credentials, not sure if this will be needed. 
	eventsHosting: [{type: Number, ref: 'Event'}],
  	eventsAttending: [{type: Number, ref: 'Event'}],
});

// TODO create private and public methods
// e.g. "var f = function (...) {...}" is private;
//      "[schema].statics.f = function (...) {...}" is public

var User = mongoose.model('User', userSchema);

module.exports = User;
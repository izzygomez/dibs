// Main author: Brian Saavedra

// Grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// User schema is created
var userSchema = new Schema({
	_id: Number,					// Will be the Facebook ID assigned to the user
	username: String,
	token: String,	// Facebook Credentials, not sure if this will be needed. 
	eventsHosting: [{type: Number, ref: 'Event'}],
  	eventsAttending: [{type: Number, ref: 'Event'}],
});

/*
Might need to include the username in the userSchema
Would also need to include a method to get the username in the userSchema.
*/

/*
Requires UserID to be of Object ID type.
More information can be found here
https://docs.mongodb.org/manual/reference/object-id/
*/
userSchema.statics.userExists = function(userID, callback){
	var userPresence = null;
	User.findOne({_id: userID}, function(err, matchedUser){
		if (err !== null){
			console.log("Got an error", err);
			res.send(500);
		} else{
			if (matchedUser === null){
				userPresence = false;
			} else{
				userPresence = true;
			}
		}
		callback(userPresence);
	});
}

userSchema.statics.getUser = function(userID, callback){
	var currentUser = null;
	User.userExists(userID, function(bool){
		if (bool){
			User.findOne({_id: userID}, function(err, matchedUser){
				if (err !== null){
					console.log("Got an error", err);
					res.send(500);
				} else{
					currentUser = matchedUser;
				}
				callback(bool, currentUser);
			});
		} else{
			callback(bool, currentUser);
		}
	});
}

userSchema.statics.createNewUser = function(userID, token, hostedEvents, attendingEvents, callback){
	User.userExists(username, function(bool){
		if (bool){
			callback({taken: true});
		} else{
			User.create({_id: userID,
						token: token,
						eventsHosting: hostedEvents,
						eventsAttending: attendingEvents});
			callback(null);
		}
	});
}

userSchema.statics.getEventsHosting = function(userID, callback){
	User.getUser(userID, function(bool, actualUser){
		if (bool){
			callback(null, actualUser.eventsHosting);
		} else{
			callback({msg: 'Invalid user'});
		}
	});
}

userSchema.statics.getEventsAttending = function(userID, callback){
	User.getUser(userID, function(bool, actualUser){
		if (bool){
			callback(null, actualUser.eventsAttending);
		} else{
			callback({msg: 'Invalid user'});
		}
	});
}

userSchema.statics.getToken = function(userID, callback){
	User.getUser(userID, function(bool, actualUser){
		if (bool){
			callback(null, actualUser.token);
		} else{
			callback({msg: 'Invalid user'});
		}
	});
}

userSchema.statics.getUsername = function(userID, callback){
	User.getUser(userID, function(bool, actualUser){
		if (bool){
			callback(null, actualUser.username);
		} else{
			callback({msg: 'Invalid user'});
		}
	});
}

userSchema.statics.addHostedEvent = function(userID, hostedEvent, callback){
	User.getUser(userID, function(bool, actualUser){
		if (bool){
			var hostedEvents = actualUser.eventsHosting;
			hostedEvents.push(hostedEvent);
			User.update({_id: userID}, {$set: {eventsHosting: hostedEvents}}, {upsert: true}, function(){});
			callback(null);
		} else{
			callback({msg: 'Invalid user'});
		}
	});
}

userSchema.statics.addAttendingEvent = function(userID, attendingEvent, callback){
	User.getUser(userID, function(bool, actualUser){
		if (bool){
			var attendingEvents = actualUser.eventsAttending;
			attendingEvents.push(attendingEvent);
			User.update({_id: userID}, {$set: {eventsAttending: attendingEvents}}, {upsert: true}, function(){});
			callback(null);
		} else{
			callback({msg: 'Invalid user'});
		}
	});
}

var User = mongoose.model('User', userSchema);

module.exports = User;
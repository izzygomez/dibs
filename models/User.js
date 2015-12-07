// Main author: Brian Saavedra

// Grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// User schema is created
var userSchema = new Schema({
	_id: Number,					// Will be the Facebook ID assigned to the user
	username: String,
	token: String,	// Facebook Credentials, not sure if this will be needed. 
	suggestions: Number
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

userSchema.statics.createNewUser = function(userID, token, username, callback){
	User.userExists(userID, function(bool){
		if (bool){
			callback({taken: true});
		} else{
			User.create({_id: userID,
						token: token,
						username: username,
						suggestions: 3});
			callback(null);
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

userSchema.statics.getSuggestions = function(userID, callback){
	User.getUser(userID, function(bool, actualUser){
		if (bool){
			callback(null, actualUser.suggestions);
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

var User = mongoose.model('User', userSchema);

module.exports = User;
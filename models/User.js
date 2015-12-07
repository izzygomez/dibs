// Main author: Brian Saavedra

// Grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// User schema is created
var userSchema = new Schema({
	_id: Number,					// Will be the Facebook ID assigned to the user
	token: String,	// Facebook Credentials, not sure if this will be needed. 
	suggestions: Number,
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

userSchema.statics.createNewUser = function(userID, token, callback){
	User.userExists(userID, function(bool){
		if (bool){
			callback({taken: true});
		} else{
			User.create({_id: userID,
						token: token,
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

userSchema.statics.checkSuggestionsLimit = function(userID, callback){
	User.getUser(userID, function(bool, actualUser){
		console.log("found user");
		if (bool){
			User.getSuggestions(userID, function(suggestions){
				console.log("found suggestions");
				console.log(suggestions);
				var newCount;
				if (suggestions >= 1){
					console.log("updating suggestions");
					newCount = suggestions - 1
					User.update({_id: userID}, {$set: {suggestions: newCount}}, function(){});
					callback(true)
				}
				if (suggestions === 1){
					newCount - 1;
					User.update({_id: userID}, {$set: {suggestions: newCount}}, function(){});
					callback(true)
				}
				else{
					console.log("failed");
					callback(false);
				}
			});
		} else{
			callback({msg: 'Invalid user'});
		}
	});
}

var User = mongoose.model('User', userSchema);

module.exports = User;
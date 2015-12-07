// Main Author: Brian Saavedra

var assert = require("assert");
var User = require('../models/User');

describe('User', function() {
	// Create a user to run the tests with.
	User.createNewUser(1, "thisUsersToken", function(){});

	// First function
  	describe('#userExists', function (){
    	it('Should return false since this user does not exist', function () {
	    	var userID = 4;
	    	User.userExists(userID, function(result){
	    		assert.equal(result, false);
	    		done();
	    	});
    	});

    	it('Should return true since this user does exist', function(){
    		var userID = 1;
	    	User.userExists(userID, function(result){
	    		assert.equal(result, true);
	    		done();
	    	});
    	});
    });

    // Second function
    describe('#getUser', function(){
    	it('Should return the user when the userID is called.', function(){
    		var userID = 1;
    		var actualUser = {_id: 1, token: 'thisUsersToken', suggestions: 3};
    		User.getUser(userID, function(bool, returnedUser){
    			assert.equal(bool, true);
    			assert.deepEqual(actualUser, returnedUser);
    			done();
    		});
    	});
    });

    // Third function
    describe('#getToken', function(){
    	it('Should return the token of the user when the userID is used as input', function(){
    		var userID = 1;
    		var userToken = 'thisUsersToken';
    		User.getToken(userID, function(err, actualToken){
    			assert.equal(userToken, actualToken);
    			done();
    		});
    	});
    });

    // Fourth function
    describe('#getSuggestions', function(){
    	it('Should return the number of suggestions a user has left', function(){
    		var userID = 1;
    		var suggestions = 3;
    		User.getSuggestions(userID, function(err, numSuggestions){
    			assert.equal(suggestions, numSuggestions);
    			done();
    		});
    	});
    });
});


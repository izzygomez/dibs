// var express = require('express');

module.exports = function (app, passport) {
	/*
	  GET /auth/facebook
	  route for facebook authentication and login
	*/
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email', 'user_events'] }));

	/*
	  GET /auth/facebook/callback
	  handle the callback after facebook has authenticated the user 
	*/
	app.get('/auth/facebook/callback', 
		passport.authenticate('facebook', {
			successRedirect: '/dashboard',
			failureRedirect: '/'
		}));
};
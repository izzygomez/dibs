var express = require('express');
var router = express.Router();

/*
  GET /facebook/events
*/
router.get('/events', isLoggedIn, function (req, res) {
	// TODO implement this
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}

module.exports = router;  
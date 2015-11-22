var express = require('express');
var router = express.Router();

/*
  GET /dashboard
*/
router.get('/', isLoggedIn, function (req, res) {
  res.render('dashboard', { user: req.user });
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}

module.exports = router;  
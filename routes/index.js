var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index');
});

function isLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();	
	}
	res.redirect('/dashboard');
}

module.exports = router;

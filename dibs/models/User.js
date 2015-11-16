// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
	// TODO define schema
});

// TODO create private and public methods
// e.g. "var f = function (...) {...}" is private;
//      "[schema].statics.f = function (...) {...}" is public

var User = mongoose.model('User', userSchema);

module.exports = User;
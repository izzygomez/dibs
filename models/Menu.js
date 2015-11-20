// Main Author: Daniel Lerner


// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var menuSchema = new Schema({
  _id: Number,
  drinks: [{drink: String, stock: Number}]
});

// TODO create private and public methods
// e.g. "var f = function (...) {...}" is private;
//      "[schema].statics.f = function (...) {...}" is public

var Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
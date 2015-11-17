// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var eventSchema = new Schema({
  host: {type: Number, ref: 'User'},
  drinkLimit: Number,
  guests: [{type: Number, ref: 'User'}],
  menu: {type: Number, ref: 'Menu'},
  queue: {type: Number, ref: 'Queue'},
  title: String, 
  startTime: Date,
  endTime: Date
});

// TODO create private and public methods
// e.g. "var f = function (...) {...}" is private;
//      "[schema].statics.f = function (...) {...}" is public

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
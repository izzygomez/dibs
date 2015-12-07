var assert = require("assert");
var Event = require("../models/Event");

describe('Event', function() {

	// eventExists
	// findByID
	// createNewEvent
	// addSuggestion
	// isHappening
	// getSuggestions
	// checkLimit
	// checkSuggestionLimit
	// decreaseSuggestionCount
	// decreaseLimit
	// updateEvent
	// setLimit
	var date1 = new Date(2015, 12, 1);
	var date2 = new Date(2015, 12, 2);
	var date3 = new Date(1995, 7, 30);
	var date4 = new Date(1995, 8, 12);
	var hosts = [4];
	var newHosts = [40];
	var guests = [{user: 1, drinksOrdered: 4, suggestions: 2}];
	var newGuests = [10, 20, 30];
	var limit = 5;
	var newLimit = 25;
	var title = "Testing Party";

	// createNewEvent is used by all of the other tests
	Event.createNewEvent(12345, title, date1, date2, guests, hosts, limit, function(){});

	describe('#eventExists()', function() {
		it('should say whether or not the event is in the database', function(){
			Event.eventExists(12345, function(exists) {
				assert.Equal(true, exists);
				done();
			});
		});
	});

	describe('#findByID()', function() {
		it('should get the event with the given ID', function() {
			Event.findByID(12345, function(evt) {
				assert.deepEqual({_id: 12345, hosts: hosts, drinkLimit: limit, 
								  guests: guests, suggestions: [], menu: 12345,
								  queue: 12345, _title: title, startTime: date1,
								  endTime: date2}, evt);
				done();
			});
		});
	});

	describe('#addSuggestion()', function() {
		it('should add the given suggestion', function() {
			Event.addSuggestion(12345, "Lemonade", function(){});
			Event.findByID(12345, function(evt) {
				assert.deepEqual([{drink: "Lemonade", count: 1}], evt.suggestions);
				done();
			});
		});
	});

	describe('#isHappening()', function() {
		it('should say whether the event is happening', function() {
			Event.isHappening(12345, function(err, bool) {
				assert.Equal(false, bool);
				done();
			});
		});
	});

	describe('#getSuggestions()', function() {
		it('should get all the suggestions for an event', function() {
			Event.getSuggestions(12345, function(err, sgs) {
				assert.deepEqual([{drink: "Lemonade", count: 1}], sgs);
				done();
			});
		});
	});

	describe('#checkLimit()', function() {
		it('should say whether the user has reached the drink limit', function() {
			Event.checkLimit(1, 12345, function(bool) {
				assert.Equal(false, bool);
				done();
			});
		});
	});

	describe('#checkSuggestionLimit()', function() {
		it('should say whether the user has reached the suggestion limit', function() {
			Event.checkSuggestionLimit(1, 12345, function(bool) {
				assert.Equal(false, bool);
				done();
			});
		});
	});

	describe('#decreaseSuggestionCount()', function() {
		it('should decrease a user suggestion count by 1', function() {
			Event.decreaseSuggestionCount(1, 12345, function() {
				Event.findByID(12345, function(evt) {
					assert.Equal(1, evt.guests[0].suggestions);
					done();
				});
			});
		});
	});

	describe('#decreaseLimit()', function() {
		it('should add a drink to the drinksOrdered for a user', function() {
			Event.decreaseLimit(1, 12345, function() {
				Event.findByID(12345, function(evt) {
					assert.Equal(5, evt.guests[0].drinksOrdered);
					done();
				});
			});
		});
	});

	describe('#updateEvent()', function() {
		it('should update the Event in the database with new information', function() {
			Event.updateEvent(12345, title, date3, date4, newGuests, newHosts, function() {
				assert.deepEqual({_id: 12345, hosts: newHosts, drinkLimit: limit, 
								  guests: guests, suggestions: [], menu: 12345,
								  queue: 12345, _title: title, startTime: date1,
								  endTime: date2}, evt);
				done();
			});
		});
	});

	describe('setLimit()', function() {
		it('should set the drink limit as specified', function() {
			Event.setLimit(12345, newLimit, function() {
				Event.findByID(12345, function(evt) {
					assert.Equal(newLimit, evt.drinkLimit);
					done();
				});
			});
		});
	});

});
// Main author: Brian Saavedra

// TODO: Check what the error class is, in the register event listener.

// Wrapped in an immediately invoked function expression.
(function() {
	// Logic to register an event with the DIBS app.
	// Only the host can see this.
	$(document).on('click', '.register-button', function(evt){
		var item = $(this).parent();
		var eventID = item.data('event-id');
		// Post to the events
		$.post(
			'/events',
			{eventID: eventID}
		).done(function(response){
			loadDashboard();
		}).fail(function(responseObject){
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	// Logic to go to an event 
	$(document).on('click', '.gotoEvent', function(evt){
		// TODO: Correct when the actual HTML format for this is figured out.
		var item = $(this).parent();
		var eventID = item.data('event-id');
		// TODO: Need to get information from the Facebook api regarding the event's info
		// Load the ejs templates for this.
	});

})();
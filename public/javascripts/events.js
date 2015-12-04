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
	
	/*
	Submits guest suggestions before an event
	*/
	$(document).on('submit', '#suggest-form', function(evt) {
		evt.preventDefault();
		var item = $(this).parent();
		var eventID = item.data('id');
		var formData = helpers.getFormData(this);
		formData["eventID"] = eventID;
		$.post(
			'/events/suggest',
			formData
		).done(function(response) {
			loadDashboard();
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});
})();
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

	$(document).on('click', '.removeDrink', function(evt){
		evt.preventDefault();
		var item = $(this).parent();
		var greatGrandpa = $(this).parent().parent().parent().parent().parent();
		var menuID = greatGrandpa.data('id');
		var drinkName = item.data('drink');
		$.post(
			'/menus/removeDrink',
			{drink: drinkName, menuID: menuID}
		).done(function(response){
			loadSuggestionsPage(response.content)
		}).fail(function(responseObject){
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	$(document).on('click', '#setStock', function(evt){
		evt.preventDefault();
		var item = $(this).parent();
		var drinkName = item.data('drink');
		var stock = $("#" + drinkName).val();
		var menuID = $("#setStock").data('menu-id')

		$.post(
			'/menus/updatePreStock',
			{drink: drinkName, menuID: menuID, stock: stock  }
		).done(function(response){
			loadSuggestionsPage(response.content)
		}).fail(function(responseObject){
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	// // Logic to go to an event 
	// $(document).on('click', '.gotoEvent', function(evt){
	// 	// TODO: Correct when the actual HTML format for this is figured out.
	// 	var item = $(this).parent();
	// 	var eventID = item.data('event-id');
	// 	// TODO: Need to get information from the Facebook api regarding the event's info
	// 	// Load the ejs templates for this.
	// });
	
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
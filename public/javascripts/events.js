// Main author: Brian Saavedra

// TODO: Check what the error class is, in the register event listener.

// Wrapped in an immediately invoked function expression.
(function() {

	// Calls route to register an event on dibs and reloads the user's dashboard if successful
	$(document).on('click', '.register-button', function(evt){
		var item = $(this).parent();
		var eventID = item.data('event-id');
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

	// Calls route to remove drink from specified menu page
	// Reloads updated menu page if successful (shows Queue if event is happening now, Suggestions page otherwise)
	$(document).on('click', '.removeDrink', function(evt){
		evt.preventDefault();
		var item = $(this).parent();
		var menuID = $("#setStock").data('menu-id');
		var drinkName = item.data('drink');
		$.post(
			'/menus/removeDrink',
			{drink: drinkName, menuID: menuID}
		).done(function(response){
			if (response.content.happening){
				loadQueuePage(menuID);
			}
			else{
				loadSuggestionsPage(response.content);
			}
		}).fail(function(responseObject){
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	// Calls route to set stock for a specified drink
	// Reloads updated menu page if successful (shows Queue if event is happening now, Suggestions page otherwise)
	$(document).on('click', '#setStock', function(evt){
		evt.preventDefault();
		var item = $(this).parent();
		var drinkName = item.data('drink');
		var stock = $("#" + drinkName).val();
		var menuID = $("#setStock").data('menu-id');

		$.post(
			'/menus/updatePreStock',
			{drink: drinkName, menuID: menuID, stock: stock}
		).done(function(response){
			if (response.content.happening){
				loadQueuePage(menuID);
			}
			else{
				loadSuggestionsPage(response.content);
			}
		}).fail(function(responseObject){
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	// Calls route to set drink limit for an event
	// Reloads suggestions page if successful
	$(document).on('click', '#setDrinkLimit', function(evt) {
		evt.preventDefault();
		var drinkLimit = $('#limitBox').val();
		var eventID = $('.hostSuggestions').data('id');
		$.post(
			'/menus/setDrinkLimit',
			{eventID: eventID, limit: drinkLimit}
		).done(function(response) {
			loadSuggestionsPage(response.content);
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	/*
	When the host clicks Add to Menu from suggestions
	*/
	$(document).on('click', '#addToMenu', function(evt) {
		evt.preventDefault();
		var drink = $(this).data('drink');
		var menuID = $('.hostSuggestions').data('id');
		$.post(
			'/menus/addDrink',
			{drink: drink, menuID: menuID, stock: 0}
		).done(function(response) {
			loadSuggestionsPage(response.content);
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	$(document).on('click', '#addCustomDrink', function(evt){
		evt.preventDefault();
		var item = $(this).parent();
		var drinkName = $("#customName").val();
		var menuID = $("#customStock").data("menu-id");
		var stock = $("#customStock").val();

		$.post(
			'/menus/addDrink',
			{drink: drinkName, menuID: menuID, stock: stock  }
		).done(function(response){
			if (response.content.happening){
				loadQueuePage(menuID);
			}
			else{
				loadSuggestionsPage(response.content);
			}		
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
			alert("You are out of suggestions for this event!");
			loadDashboard();
		});
	});
})();
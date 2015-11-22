// Main Author: Sara Stiklickas

// Wrapped in an immediately invoked function expression.
(function() {
	$(document).on('click', '#submit-dibs', function(evt) {
		var drink; // get drink from menu item clicked
		var currentUser; // get currentUser somehow
		var eventID; // get eventID from menu?
		$.post(
			'/orders',
			{drink: drink, from: currentUser}
		).done(function(response) {
			loadWaitingPage(); // page that waits for notification
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	$(document).on('click', '#served-button', function(evt) {
		var item = $(this).parent();
		var orderID = item.data('order-id'); // need to give orders a data-order-id class
		$.post(
			'/orders/served',
			{orderID: orderID}
		).done(function(response) {
			loadQueuePage(); // reload queue page, order should be removed
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	$(document).on('click', '#notify-button', function(evt) {
		var item = $(this).parent();
		var orderID = item.data('order-id');
		$.post(
			'/orders/notified',
			{orderID: orderID}
		).done(function(response) {
			loadQueuePage(); // still same page
		}).fail(function(responseObject) {
			var response = $.parseJson(responseObject.responseText);
			$('.error').text(response.err);
		});
	});
});
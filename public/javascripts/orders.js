// Main Author: Sara Stiklickas

// Wrapped in an immediately invoked function expression.
(function() {
	$(document).on('click', '#submit-dibs', function(evt) {
		var drink = $(this).data('drink'); //get drink from menu item
		var eventID = $(this).parent().parent().parent().data('id'); // get menuID
		$.post(
			'/orders',
			{drink: drink, eventID: eventID}
		).done(function(response) {
			var orderID = response.content.orderID;
			loadMenuPage(eventID); // page that waits for notification
			var isReadyFunc = function(){
				$.get('/orders/status', {orderID: orderID}, function(response) {
					if (response.content._status === 1) {
						loadMenuPage(eventID);
						clearInterval(ready);
					}
				});
			}
			var ready = setInterval(isReadyFunc, 5000);
			var isServedFunc = function(){
				$.get('/orders/status', {orderID: orderID}, function(response) {
					if (response.content._status === 2) {
						loadMenuPage(eventID);
						clearInterval(served);
					}
				});
			}
			var served = setInterval(isServedFunc, 5000);
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	$(document).on('click', '#servedButton', function(evt) {
		var orderID = $('.queue').data('order-id');
		var eventID = $('.queue').data('id');

		$.post(
			'/orders/served',
			{orderID: orderID}
		).done(function(response) {
			loadQueuePage(eventID); // reload queue page, order should be removed
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	$(document).on('click', '#notifyButton', function(evt) {
		var orderID = $('.queue').data('order-id');
		var eventID = $('.queue').data('id');

		$.post(
			'/orders/notified',
			{orderID: orderID}
		).done(function(response) {
			loadQueuePage(eventID); // still same page
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});
})();
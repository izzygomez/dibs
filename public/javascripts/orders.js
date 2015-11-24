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
			console.log("HI");
			loadWaitingPage(); // page that waits for notification
			var ready = setInterval(function(){
				$.get('/orders/status', function(response) {
					if (response.status === 1) {
						loadNotificationPage();
						clearInterval(ready);
					}
				});
			}, 3000);
			var served = setInterval(function(){
				$.get('/orders/status', function(response) {
					if (response.status === 2) {
						loadMenuPage();
						clearInterval(served);
					}
				});
			}, 3000);
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	$(document).on('click', '#servedButton', function(evt) {
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

	$(document).on('click', '#notifyButton', function(evt) {
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
})();
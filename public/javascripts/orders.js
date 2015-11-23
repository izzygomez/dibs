// Main Author: Sara Stiklickas


// Wrapped in an immediately invoked function expression.
(function() {
	var Order = require('../models/Order');
	
	$(document).on('click', '#submit-dibs', function(evt) {
		var item = $(this).parent();
		var drink = item.data('drink'); //get drink from menu item
		var currentUser = req.user._id;
		var eventID = item.data('id'); // get menuID
		$.post(
			'/orders',
			{drink: drink, from: currentUser, eventID: eventID}
		).done(function(response) {
			loadWaitingPage(); // page that waits for notification
			var isReady = false;
			while (!isReady) {
				Order.getOrder(response.orderID, function(order){
					if (order.status === 1) {
						isReady = true;
					}
				});
			}
			loadNotificationPage();
			var isServed = false;
			while (!isServed) {
				Order.getOrder(response.orderID, function(order) {
					if (order.status === 2) {
						isServed = true;
					}
				});
			}
			loadQueuePage();
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
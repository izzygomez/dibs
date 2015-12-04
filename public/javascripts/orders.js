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
			// console.log("Successfully posted drink!");
			var orderID = response.content.orderID;
			loadWaitingPage(); // page that waits for notification

			var isReadyFunc = function(){
				// console.log("calling isReadyFunc...");
				$.get('/orders/status', {orderID: orderID}, function(response) {
					// console.log("here's a sample response object");
					// console.log(response);
					// console.log("Successfully returned from GET orders/status to isReadyFunc");
					// console.log("Here's the current status: " + response.content._status);
					if (response.content._status === 1) {
						// console.log("DRINK NOTIFIED! Should load notification page and stop this interval call");
						loadNotificationPage();
						clearInterval(ready);
					}
				});
			}

			var ready = setInterval(isReadyFunc, 5000);

			var isServedFunc = function(){
				// console.log("calling isServedFunc...");
				$.get('/orders/status', {orderID: orderID}, function(response) {
					// console.log("Successfully returned from GET orders/status to isServedFunc");
					// console.log("Here's the current status: " + response.content._status);
					if (response.content._status === 2) {
						// console.log("DRINK SERVED! Should load menu page and stop this interval call")
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
		var item = $(this).parent();
		var orderID = item.data('order-id'); 
		var eventID = $(this).parent().data('id');
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
		var item = $(this).parent();
		var orderID = item.data('order-id');
		var eventID = $(this).parent().data('id');
		// console.log(eventID);
		$.post(
			'/orders/notified',
			{orderID: orderID}
		).done(function(response) {
			// console.log('done '+ eventID);
			loadQueuePage(eventID); // still same page
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});
})();
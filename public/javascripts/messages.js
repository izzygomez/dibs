// Main Author: Daniel Lerner

// Wrapped in an immediately invoked function expression.
(function() {
  $(document).on('click', '#notify', function(evt) {
    evt.preventDefault();
    var item = $(this).parent();
	var orderID = item.data('order-id');
	$.get('/status', {orderID: orderID}, function(response) {
		if (response.change){
			loadPage(response);
		}
	});
  });

  $(document).on('click', '.suggest-button', function(evt) {
    evt.preventDefault();
    var item = $(this).parent();
	var eventID = item.data('event-id');
	$.get('/guestPreEvent', {eventID: eventID}, function(response) {
		if (response.content.happening != true){
			loadGuestSuggestPage(response.content._event);
		}
		else{
			loadMenuPage(eventID);
		}
	});
  });

  $(document).on('click', '.see-suggestions-button', function(evt) {
    evt.preventDefault();
    var item = $(this).parent();
	var eventID = item.data('event-id');
	$.get('/hostPreEvent', {eventID: eventID}, function(response) {
		if (response.content.happening != true){
			var eventData = {_event: response.content._event, menu: response.content.menu};
			loadSuggestionsPage(eventData);
		}
		else{
			loadQueuePage(eventID);
		}
	});
  });
})();
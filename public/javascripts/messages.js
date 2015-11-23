// Main Author: Daniel Lerner

// Wrapped in an immediately invoked function expression.
(function() {
  $(document).on('click', '#notify', function(evt) {
    evt.preventDefault();
	$.get('/index/notify', function(response) {
		if (response){
			loadPage(response);
		}
	});
  });

  $(document).on('click', '#ordered', function(evt) {
   	evt.preventDefault();
	$.get('/index/waiting', function(response) {
		if (response){
			loadPage(response);
		}
	});
  });

  $(document).on('click', '.suggest-button', function(evt) {
    evt.preventDefault();
    var item = $(this).parent();
	var eventID = item.data('event-id');
	$.get('/guestPreEvent', {eventID: eventID}, function(response) {
		if (response){
			loadPage(response);
		}
	});
  });

  $(document).on('click', '.see-suggestions-button', function(evt) {
    evt.preventDefault();
    console.log("see suggestions");
    var item = $(this).parent();
	var eventID = item.data('event-id');
	$.get('/hostPreEvent', {eventID: eventID}, function(response) {
		if (response){
			loadPage(response);
		}
	});
  });
})();
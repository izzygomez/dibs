// Main Author: Daniel Lerner

// Wrapped in an immediately invoked function expression.
(function() {
  $(document).on('click', '#notify', function(evt) {
    evt.preventDefault();
	$.get('index/notify', function(response) {
		if (response){
			loadPage(response);
		}
	});
  });

  $(document).on('click', '#ordered', function(evt) {
   	evt.preventDefault();
	$.get('index/waiting', function(response) {
		if (response){
			loadPage(response);
		}
	});
  });

  $(document).on('click', '#attendEvent', function(evt) {
    evt.preventDefault();
    var item = $(this).parent();
	var eventID = item.data('event-id');
	$.get('index/guestPreEvent', function(response, eventID) {
		if (response){
			loadPage(response);
		}
	});
  });

  $(document).on('click', '#hostEvent', function(evt) {
    evt.preventDefault();
    var item = $(this).parent();
	var eventID = item.data('event-id');
	$.get('index/hostPreEvent', function(response, eventID) {
		if (response){
			loadPage(response);
		}
	});
  });
});
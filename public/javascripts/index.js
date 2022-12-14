currentUser = undefined; //sessions stuff?

var loadDashboard = function(){
	$.get('/facebook/events', function (response) {
		loadPage(response);
	});
};

var loadWaitingPage = function(){
	$.get('/waiting', function(response) {
		loadPage(response);
	});
};

var loadNotificationPage = function(){
	$.get('/notify', function(response) {
		loadPage(response);
	});
};

var loadGuestSuggestPage = function(_event){
	$.get('/guestSuggest', {_event: _event}, function(response) {
		loadPage(response);
	});
}

var loadSuggestionsPage = function(eventData){
	$.get('/suggestions', {eventData: eventData}, function(response) {
		loadPage(response);
	});
};

var loadQueuePage = function(queueID){
	$.get('/queues', {queueID: queueID}, function(response) {
		loadPage(response);
	});
};

var loadMenuPage = function(menuID){
	$.get('events/menu', {menuID: menuID}, function(response) {
		loadPage(response);
	});
};

var loadPage = function(data) {
	$('#main-content').html(data);
};
currentUser = undefined; //sessions stuff?

var loadDashboard = function(){
	$.get('/facebook/events', function (response) {
		loadPage(response);
	});
};

var loadWaitingPage = function(){};

var loadQueuePage = function(queueID){
	$.get('queue', {queueID: queueID}, function(response) {
		loadPage(response);
	});
};

var loadNotificationPage = function(){};

var loadMenuPage = function(){
	$.get('events/menu', function(response) {
		loadPage(response);
	});
};

var loadPage = function(data) {
	$('#main-content').html(data);
};
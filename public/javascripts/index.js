currentUser = undefined; //sessions stuff?

var loadDashboard = function(){
	console.log("got to loadDashboard()");
	$.get('/facebook/events', function (response) {
		// TODO implement this
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
	$('.container').html(data);
};
currentUser = undefined; //sessions stuff?

var loadDashboard = function(){};

var loadWaitingPage = function(){};

var loadQueuePage = function(){};

var loadNotificationPage = function(){};

var loadMenuPage = function(){
	$.get('events/menu', function(response) {
		loadPage(response);
	});
};

var loadPage = function(data) {
	$('.container').html(data);
};
currentUser = undefined; //sessions stuff?

var loadDashboard = function(){
	$.get('/facebook/events', function (response) {
		loadPage(response);
	});
};

var loadWaitingPage = function(orderID){
	$.get('/status'), {orderID: orderID, function(response) {
		loadPage(response);
	}}
};

var loadQueuePage = function(queueID){
	$.get('queues/', {queueID: queueID}, function(response) {
		if (response.change){
			loadPage(response);
		}
	});
};

var loadNotificationPage = function(orderID){
	$.get('/status', {orderID: orderID}, function(response) {
		if (response.change){
			loadPage(response);
		}
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
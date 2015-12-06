// Main author: Daniel Lerner

// Wrapped in an immediately invoked function expression.
(function() {
	$(document).on('click', '#remove-drink', function(evt){
		evt.preventDefault();
		var item = $(this).parent();
		var greatGrandpa = $(this).parent().parent().parent();
		var menuID = greatGrandpa.data{'data-id'};
		var drinkName = item.data('data-drink');
		$.post(
			'/menus/removeDrink',
			{drink: drinkName, menuID: menuID}
		).done(function(response){
			loadSuggestionsPage(response.eventData)
		}).fail(function(responseObject){
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});
})();
// Main Author: Daniel Lerner

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Create the Menu schema 
* Defined by id, and a list of drinks.
* Each drink has a name and stock value
*/
var menuSchema = new Schema({
  _id: Number,
  drinks: [{drink: String, stock: Number}]
});


/**
* Checks if menu exists in database
* @param: menuID: ID of menu to check database for
* returns true if menu stored in database, false otherwise
**/
var menuExists = function(menuID, callback){
  var exists = null;
  Menu.findOne({_id: menuID}, function(err, menu){
    if (menu == null){
      exists = false}
    else{
      exists = true;
    }
    callback(exists);
  });
}

/**
* Get target Menu using inputted id
* @param: menuID: ID of menu to check database for
* returns menu object if found in database, null otherwise
**/
menuSchema.statics.getMenu = function(menuID, callback){
  var result;
  Menu.findOne({_id: menuID}, function(err, menu){
    if (menu == null){
      result = null;
    }
    else{
      result = menu
    }
    callback(result);
  });
}

/*
* Gets list of drinks on Menu
* @param: menuID: ID of menu to check database for
* returns list of drinks for acquired menu
* Error message thrown if menu ID invalid
*/
menuSchema.statics.getMenuDrinks = function(menuID, callback){
	var drinks;
	menuExists(menuID, function(exists){
		if (exists){
			Menu.findOne({_id: menuID}, function(err, menu){
				if (menu == null){
					drinks = null;
				}
				else{
					drinks = menu.drinks
				}
				callback(drinks)
			});
		}
		else {
			callback({msg: "Invalid Menu ID"});
		}
	});
}

/**
* Adds drink to Menu, updates database
* @param: menuID: ID of menu to check database for
* @param: drink: name of drink to add to menu
* returns error message if drink already added to menu, null otherwise
**/
menuSchema.statics.addDrinkOrder = function(menuID, drink, callback){
	Menu.getMenuDrinks(menuID, function(drinks){
		var pushDrink = true;
		drinks.forEach(function(savedDrink){
			if (savedDrink.drink.toLowerCase() === drink.drink.toLowerCase()){
				pushDrink = false;
				callback({msg: "Drink has already been added to Menu"})
			}
		});
		if (isNaN(drink.stock)){
			callback({msg: "Invalid stock input"});
			pushDrink = false;
		}
		if(pushDrink){
			drinks.push(drink);
			Menu.update({_id: menuID}, {$set: {drinks: drinks}}, function(){
				callback(null);
			});
		}
	});
}

/**
* Removes drink from Menu, updates database
* @param: menuID: ID of menu to check database for
* @param: drinkName: name of drink to remove from menu
**/
menuSchema.statics.removeDrink = function(menuID, drinkName, callback){
	var targetDrink;
	Menu.getMenuDrinks(menuID, function(drinks){
		drinks.forEach(function(drink){
			if(drink.drink == drinkName){
				targetDrink = drinkName;
			}
		});
			var updated = drinks.filter(function(drink) {
				return drink.drink !== targetDrink
			})
			Menu.update({_id: menuID}, {$set: {drinks: updated}}, function(){});
			callback(null);
	});
}

/**
* Updates stock of drink on menu during event, reports to user if out of stock
* @param: menuID: ID of menu to check database for
* @param: drinkName: name of drink to update stock of
* returns error message if drink out of stock, null otherwise
**/
menuSchema.statics.updateStock = function(menuID, drinkName, callback)
{
	var targetDrink;
	Menu.getMenuDrinks(menuID, function(drinks){
		drinks.forEach(function(drink){
			if(drink.drink == drinkName){
				targetDrink = drink;
			}
		});
		if (targetDrink.stock == 0){
			callback({msg: "Sorry, we're out of that drink :("})
		}
		else{
			var updated = drinks.map(function(drink) {
				if(drink.drink == drinkName) {
					return {drink: drinkName, stock: drink.stock-1};
				} else {
					return drink;
				}
			})
			Menu.update({_id: menuID}, {$set: {drinks: updated}}, function(){});
			callback(null);
		};
	})
}

/**
* Updates stock of drink on menu before an event is happening
* @param: menuID: ID of menu to check database for
* @param: drinkName: name of drink to update stock of
* @param: stock: new stock to update inputted drink
**/
menuSchema.statics.updatePreStock = function(menuID, drinkName, stock, callback)
{
	var targetDrink;
	Menu.getMenuDrinks(menuID, function(drinks){
		drinks.forEach(function(drink){
			if(drink.drink == drinkName){
				targetDrink = drink;
			}
		});

		var updated = drinks.map(function(drink) {
			if(drink.drink == drinkName) {
				return {drink: drinkName, stock: stock};
			} else {
				return drink;
			}
		});
		Menu.update({_id: menuID}, {$set: {drinks: updated}}, function(){});
		callback(null);
	})
}

/**
* Creates new Menu for event
* menuID: ID of menu to check database for
**/
menuSchema.statics.createMenu = function(menuID, callback){
  menuExists(menuID, function(result){
    if (result){
      callback({taken: true});
    }
    else{
      var data = {_id: menuID, drinks: []};
      Menu.create(data);
      callback(null);
    }
  });
}

var Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
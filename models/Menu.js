// Main Author: Daniel Lerner

// grab the things that we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var menuSchema = new Schema({
  _id: Number,
  drinks: [{drink: String, stock: Number}]
});


/**
* Checks if menu exists in database
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
* Get Queue using inputted id
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
**/
menuSchema.statics.addDrinkOrder = function(menuID, drink, callback){
	getMenuDrinks(menuID, function(drinks){
		drinks.push(drink);
		Menu.update({_id: menuID}, {$push: {drinks: drinks}});
	});
	callback(null);
}

/**
* Updates stock of drink on menu, reports to user if out of stock
**/
menuSchema.statics.updateStock = function(menuID, drinkName, callback)
{
	var targetDrink;
	getMenuDrinks(menuID, function(drinks){
		drinks.forEach(function(drink){
			if(drink.drink == drinkName){
				targetDrink = drink
			}
		})
		if (targetDrink.stock == 0){
			callback({msg: "Sorry, we're out of that drink :("})
		}
		else{
			targetDrink.stock = targetDrink.stock - 1;
			var filtered = drinks.filter(function(drink){
				return drink.drink != drinkName;
			});
			Menu.update({_id: menuID}, {$push: {drinks: filtered}});
		};
	})
	callback(null);
}

/**
* Creates new Menu for event
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
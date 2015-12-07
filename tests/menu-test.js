// Main Author: Daniel Lerner


var assert = require("assert");
var Menu = require('../models/Menu');
var Event = require('../models/Event');
var eventID = "123";

describe('Menu', function() {
  describe('#getMenu(menuID)', function (){
    it('should return menu object with a blank list of drinks', function () {
        Menu.createMenu(eventID, function(err){    
        });
        var targetMenu = {_id: eventID, drinks: []};
        Menu.getMenu(eventID, function(result){
            assert.deepEqual(result, targetMenu);
            done();
        })
    });
  });


  describe('#addDrinkOrder(menuID, drink)', function (){
    it('adds drink order to menu', function () {
        var drinkList = [{drink: "Water", stock: 8},{drink: "OJ", stock: 8},{drink: "Milk", stock: 8}];
        drinkList.forEach(function(drink){
            Menu.addDrinkOrder(eventID, drink, function(err){
            })
        })
        var targetMenu = {_id: eventID, drinks: drinkList};
        Menu.getMenu(eventID, function(result){
            assert.deepEqual(result, targetMenu);
            done();
        })
    });
  });


  describe('#getMenuDrinks(menuID)', function (){
    it('should return menu object with the list of drinks and their stock for specified event', function () {
        var drinkList = [{drink: "Water", stock: 8},{drink: "OJ", stock: 8},{drink: "Milk", stock: 8}]
        var targetMenu = {_id: eventID, drinks: drinkList};
        Menu.createMenu(eventID, function(err){    
        });
        drinkList.forEach(function(drink){
            Menu.addDrinkOrder(eventID, drink, function(err){
            })
        })
        Menu.getMenuDrinks(eventID, function(result){
            var count = 0;
            result.forEach(function(drink){
                if (JSON.stringify(drink) === JSON.stringify(drinkList[count]) ){
                    count += 1
                }
            })
            assert.Equal(count, drinkList.length())
            done();
        })
    });
  });

  describe('#removeDrink(menuID, drinkName)', function (){
    it('should remove a specified drink from a specified menu', function () {
        var drinkList = [{drink: "Water", stock: 8},{drink: "OJ", stock: 8},{drink: "Milk", stock: 8}]
        var targetDrinkList = [{drink: "OJ", stock: 8},{drink: "Milk", stock: 8}]
        var targetMenu = {_id: eventID, drinks: drinkList};
        Menu.createMenu(eventID, function(err){    
        });
        drinkList.forEach(function(drink){
            Menu.addDrinkOrder(eventID, drink, function(err){
            })
        })
        Menu.removeDrink(eventID, "Water", function(result){
            var count = 0;
            result.forEach(function(drink){
                if (JSON.stringify(drink) === JSON.stringify(drinkList[count]) ){
                    count += 1
                }
            })
            assert.Equal(count, drinkList.length())
            done();
        });
    });
  });

    describe('#updateStock(menuID, drinkName)', function (){
    it('should update the stock of a specified drink from specified menu', function () {
        var drinkList = [{drink: "Water", stock: 8},{drink: "OJ", stock: 8},{drink: "Milk", stock: 8}]
        Menu.createMenu(eventID, function(err){    
        });
        drinkList.forEach(function(drink){
            Menu.addDrinkOrder(eventID, drink, function(err){
            })
        })
        Menu.updateStock(eventID, "Water", function(result){
            var resultStock = 0;
            result.forEach(function(drink){
                if (drink.drink === "Water"){
                    resultStock = drink.stock;
                }
            })
            assert.Equal(resultStock, 7)
            done();
        });
    });
  });

  describe('#updatePreStock(menuID, drinkName, stock)', function (){
    it('should update the stock of a specified drink from specified menu before an event is happening', function () {
        var drinkList = [{drink: "Water", stock: 8},{drink: "OJ", stock: 8},{drink: "Milk", stock: 8}]
        var targetDrinkList = [{drink: "Water", stock: 9}, {drink: "OJ", stock: 8},{drink: "Milk", stock: 8}]
        var targetMenu = {_id: eventID, drinks: drinkList};
        Menu.createMenu(eventID, function(err){    
        });
        drinkList.forEach(function(drink){
            Menu.addDrinkOrder(eventID, drink, function(err){
            })
        })
        Menu.updateStock(eventID, "Water", 9, function(result){
            var resultStock = 0;
            result.forEach(function(drink){
                if (drink.drink === "Water"){
                    resultStock = drink.stock;
                }
            })
            assert.Equal(resultStock, 9)
            done();
        });
    });
  });
});
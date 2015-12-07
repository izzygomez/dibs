var assert = require("assert");
var Menu = require('../models/Menu');

describe('Menu', function() {
  describe('#getMenu()', function (){
    it('should return menu object with the list of drinks and their stock for specified event', function () {
    	var eventID = "449575728562486";
    	var drinkList = [{drink: "Water", stock: 8},{drink: "OJ", stock: 8},{drink: "Milk", stock: 8}]
    	var targetMenu = {_id: eventID, drinks: drinkList};
    	Menu.getMenu(eventID, function(result){
    		assert.deepEqual(result, targetMenu);
    	})
        done();
    });
  });
});
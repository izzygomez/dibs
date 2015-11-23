// Main Author: Daniel Lerner

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Menu = require('../models/Menu');


router.get('/', function(req, res){
	Menu.getMenu(menuID, function(err, menu){
		if (err){
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else{
			utils.sendSuccessResponse(res, {menu: menu});
		}
	});
});


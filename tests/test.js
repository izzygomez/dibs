var assert = require("assert");
// var Event = require('../models/Event');
// var User = require('../models/User');
// var Menu = require('../models/Menu');
// var Order = require('../models/Order');
// var Queue = require('../models/Queue');

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});
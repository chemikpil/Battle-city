var BattleCity = BattleCity || {};

BattleCity.Keyboarder = function () {
  this.keyState = {};
  var self = this;

  window.addEventListener('keydown', function (e) {
    self.keyState[e.keyCode] = true
  });

  window.addEventListener('keyup', function (e) {
    self.keyState[e.keyCode] = false
  });
};

BattleCity.Keyboarder.prototype = {
  KEYS: {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32
  },

  isDown: function (keyCode) {
    return !!this.keyState[keyCode];
  }
};
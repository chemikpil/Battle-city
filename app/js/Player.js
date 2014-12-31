var BattleCity = BattleCity || {};

BattleCity.Player = function (game) {
  this.game = game;
  this.size = { w: 26, h: 26 };
  this.position = {
    x: (this.game.size.w / 2) - (this.size.w / 2),
    y: this.game.size.h - this.size.h
  };
  this.frame = 0;
  this.host = false;
};

BattleCity.Player.prototype = {
  update: function () {
    
  },
  
  draw: function (screen) {
    screen.fillStyle = '#adadad';
    screen.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
  }
};
var BattleCity = BattleCity || {};

BattleCity.Bullet = function (game, position, velocity) {
  this.game = game;
  this.position = position;
  this.size = {
    w: 2,
    h: 3
  };
  this.velocity = velocity;
};

BattleCity.Bullet.prototype = {
  update: function () {
    if (this.position.x < 0 || this.position.y < 0 || this.position.x > this.game.size.w || this.position.y > this.game.size.h) {
      this.game.removeBody(this);
      return; 
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  },

  draw: function (screen) {
    screen.fillStyle = '#adadad';
    screen.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
  }
};
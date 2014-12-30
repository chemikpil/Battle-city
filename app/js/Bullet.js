var BattleCity = BattleCity || {};

BattleCity.Bullet = function (game, position, velocity, id) {
  this.game = game;
  this.id = id;
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
      //this.game.removeBullet(this);
      return; 
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  },

  draw: function (screen) {
    screen.fillStyle = '#adadad';
    screen.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
  },

  toJSON: function () {
    return {
      'id': this.id,
      'x': this.position.x,
      'y': this.position.y
    };
  }
};
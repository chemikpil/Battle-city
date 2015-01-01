var BattleCity = BattleCity || {};

BattleCity.Bullet = function (game, owner, velocity) {
  this.game = game;
  this.owner = owner;
  this.velocity = velocity;
  this.position = {};
  this.size = {
    w: 2,
    h: 3
  };
  this.setDirection();
};

BattleCity.Bullet.prototype = {
  update: function () {
    if (this.position.x < 0 || this.position.y < 0 || this.position.x > this.game.size.w || this.position.y > this.game.size.h || this.game.map.checkCollision(this.position.x, this.position.y, true)) {
      this.game.removeBullet(this);
      return; 
    }
    
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  },
  
  draw: function (screen) {
    screen.fillStyle = '#adadad';
    screen.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
  },
  
  setDirection: function () {
    switch (this.owner.frame) {
        case 0:
          this.position = {x: this.owner.position.x + (this.owner.size.h / 2) - 1, y: this.owner.position.y};
          this.velocity = {x: 0, y: this.velocity}
          break;
        case 1:
          this.position = {x: this.owner.position.x + this.owner.size.h, y: this.owner.position.y + (this.owner.size.w / 2) - 1};
          this.velocity = {x: Math.abs(this.velocity), y: 0}
          break;
        case 2:
          this.position = {x: this.owner.position.x + (this.owner.size.h / 2) - 1, y: this.owner.position.y + this.owner.size.w};
          this.velocity = {x: 0, y: Math.abs(this.velocity)};
          break;
        case 3:
          this.position = {x: this.owner.position.x, y: this.owner.position.y + (this.owner.size.w / 2) - 1};
          this.velocity = {x: this.velocity, y: 0};
          break;
        default:
          throw('ERROR: unknow number of frame');
    }
  }
};
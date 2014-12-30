var BattleCity = BattleCity || {};

BattleCity.Player = function (game) {
  this.game = game;
  this.position = {
    x: this.game.size.w / 2 - 13, 
    y: this.game.size.h - 30 
  };
  this.frame = 0;
  this.size = {
    w: 26,
    h: 26
  };
  this.keyboarder = new BattleCity.Keyboarder();
};

BattleCity.Player.prototype = {
  update: function () {
    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) && (this.position.x > 0)) {
      this.position.x -= 2;
      this.frame = 3;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) && (this.position.x + this.size.w < this.game.size.w)) {
      this.position.x += 2;
      this.frame = 1;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) && (this.position.y > 0)) {
      this.position.y -= 2;
      this.frame = 0;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN) && (this.position.y + this.size.h < this.game.size.h)) {
      this.position.y += 2;
      this.frame = 2;
    }

    if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
      var data = this.bulletData();
      console.log(data);
      var bullet = new BattleCity.Bullet(
        this.game,
        data.position,
        data.velocity
      );

      this.game.addBody(bullet);
    }
  },
  
  bulletData: function () {
    var position;
    var velocity;

    switch (this.frame) {
        case 0:
          position = {x: this.position.x + (this.size.h / 2) - 1, y: this.position.y};
          velocity = {x: 0, y: -7}
          break;
        case 1:
          position = {x: this.position.x + this.size.h, y: this.position.y + (this.size.w / 2) - 1};
          velocity = {x: 7, y: 0}
          break;
        case 2:
          position = {x: this.position.x + (this.size.h / 2) - 1, y: this.position.y + this.size.w};
          velocity = {x: 0, y: 7};
          break;
        case 3:
          position = {x: this.position.x, y: this.position.y + (this.size.w / 2) - 1};
          velocity = {x: -7, y: 0};
          break;
        default:
          throw('ERROR: unknow number of frame');
    };

    return {
      position: position,
      velocity: velocity
    }
  },

  draw: function (screen) {
    var img = new Image();
    img.src = 'img/sprite.png';

    screen.drawImage(img, 
       0 + (this.size.h * this.frame), 18, 
       this.size.w, this.size.h, 
       this.position.x, this.position.y, 
       this.size.w, this.size.h
    );
  }
};
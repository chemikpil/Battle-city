var BattleCity = BattleCity || {};

BattleCity.Player = function (game) {
  this.game = game;
  this.size = { w: 26, h: 26 };
  this.position = {
    x: (this.game.size.w / 2) - (this.size.w / 2),
    y: this.game.size.h - this.size.h
  };
  this.frame = 0;
  this.velocity = 2;
  
  this.keyboarder = false;
};

BattleCity.Player.prototype = {
  update: function () {
    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) && (this.position.x > 0)) {
      this.position.x -= this.velocity;
      this.frame = 3;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) && (this.position.x + this.size.w < this.game.size.w)) {
      this.position.x += this.velocity;
      this.frame = 1;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) && (this.position.y > 0)) {
      this.position.y -= this.velocity;
      this.frame = 0;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN) && (this.position.y + this.size.h < this.game.size.h)) {
      this.position.y += this.velocity;
      this.frame = 2;
    }
  },
  
  draw: function (screen) {
    var sprite = this.game.assets.getAsset('img/player.png');
    
    screen.drawImage(sprite, 
       0 + (this.size.h * this.frame), 0, 
       this.size.w, this.size.h, 
       this.position.x, this.position.y, 
       this.size.w, this.size.h
    );
  },
  
  initKeyboarder: function () {
    this.keyboarder = new BattleCity.Keyboarder();
  }
};
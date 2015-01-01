var BattleCity = BattleCity || {};

BattleCity.Player = function (game) {
  this.game = game;
  this.size = { w: 26, h: 26 };
  this.position = {
    x: (this.game.size.w / 2) - (this.size.w / 2),
    y: this.game.size.h - this.size.h
  };
  
  this.position.x = this.position.x - 64;
  
  this.frame = 0;
  this.animationState = 0;
  this.animationStateDelay = 100;
  this.velocity = 2;
  
  this.keyboarder = false;
};

BattleCity.Player.prototype = {
  update: function () {
    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) && this.canMoveLeft()) {
      this.position.x -= this.velocity;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) && this.canMoveRight()) {
      this.position.x += this.velocity;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) && this.canMoveUp()) {
      this.position.y -= this.velocity;  
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN) && this.canMoveDown()) {
      this.position.y += this.velocity;
    }
  },
  
  draw: function (screen) {
    var sprite = this.game.assets.getAsset('img/player.png');
    
    if (this.lastAnimationState === undefined) this.lastAnimationState = 0;
    if (+new Date() - this.lastAnimationState > this.animationStateDelay) {
      this.animationState = (this.animationState === 0) ? 1 : 0;
      this.lastAnimationState = +new Date();
    }
    
    
    screen.drawImage(sprite, 
       0 + (this.size.h * this.frame), 0 + (this.animationState * this.size.w), 
       this.size.w, this.size.h, 
       this.position.x, this.position.y, 
       this.size.w, this.size.h
    );
  },
  
  initKeyboarder: function () {
    this.keyboarder = new BattleCity.Keyboarder();
  },
  
  canMoveUp:  function () {
    this.frame = 0;
    return ((this.position.y > 0)  
      && !this.game.map.checkCollision(this.position.x, this.position.y - 1) 
      && !this.game.map.checkCollision(this.position.x + this.size.w - 1, this.position.y - 1)
    );
  },
  
  canMoveDown: function () {
    this.frame = 2;
    return (
      (this.position.y + this.size.h < this.game.size.h)
      && !this.game.map.checkCollision(this.position.x, this.position.y + this.size.h) 
      && !this.game.map.checkCollision(this.position.x + this.size.w - 1, this.position.y + this.size.h)
    );
  },
  
  canMoveLeft: function () {
    this.frame = 3;
    return (
      (this.position.x > 0)
      && !this.game.map.checkCollision(this.position.x - 1, this.position.y) 
      && !this.game.map.checkCollision(this.position.x - 1, this.position.y + this.size.h - 1)
    );
  },
  
  canMoveRight: function () {
    this.frame = 1;
    return (
      (this.position.x + this.size.w < this.game.size.w)
      && !this.game.map.checkCollision(this.position.x + this.size.w, this.position.y) 
      && !this.game.map.checkCollision(this.position.x + this.size.w, this.position.y + this.size.h - 1)
    );
  }
};
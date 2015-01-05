var BattleCity = BattleCity || {};

BattleCity.Player = function (game, id, name) {
  this.game = game;
  this.name = name;
  this.size = { w: 26, h: 26 };
  this.position = {
    x: (this.game.size.w / 2) - (this.size.w / 2),
    y: this.game.size.h - this.size.h
  };
  this.id = id;
  this.shouldSync = false;
  this.isSpawning = true;
  
  this.position.x = this.position.x - 64;
  
  this.frame = 0;
  this.animationState = 0;
  this.animationStateDelay = 100;
  
  this.spawnFrame = 0;
  this.spawnStateDelay = 70;
  this.spawningTime = 15;
  
  this.velocity = 1.5;
  this.shotDelay = 500;
  this.shotVelocity = -7;
};

BattleCity.Player.prototype = {
  update: function () {
    if (this.isSpawning) { return false;}
    
    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) && this.canMoveLeft()) {
      this.position.x -= this.velocity;
      this.shouldSync = true;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) && this.canMoveRight()) {
      this.position.x += this.velocity;
      this.shouldSync = true;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) && this.canMoveUp()) {
      this.position.y -= this.velocity;  
      this.shouldSync = true;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN) && this.canMoveDown()) {
      this.position.y += this.velocity;
      this.shouldSync = true;
    }
    
    if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
      if (this.canShot()) {
        this.game.addBullet(new BattleCity.Bullet(this.game, this, this.shotVelocity));
        this.game.websocketClient.send({
          type: 'bullet',
          data: {
            id: this.id,
            velocity: this.shotVelocity
          }
        });
      }
    }
    
    if(this.shouldSync) {
      this.shouldSync = false;
      this.notify();
    }
  },
  
  draw: function (screen) {
    if (this.isSpawning) {
      this.spawn(screen);
      return false;
    }
    
    var sprite = this.game.assets.getAsset('img/player.png');
    
    if (this.lastAnimationState === undefined) this.lastAnimationState = 0;
    if (+new Date() - this.lastAnimationState > this.animationStateDelay) {
      this.animationState = (this.animationState === 0) ? 1 : 0;
      this.lastAnimationState = +new Date();
    }
    
    
    screen.drawImage(sprite, 
       0 + (this.size.w * this.frame), 0 + (this.animationState * this.size.h), 
       this.size.w, this.size.h, 
       this.position.x, this.position.y, 
       this.size.w, this.size.h
    );
  },
  
  spawn: function (screen) {
    var sprite = this.game.assets.getAsset('img/spawn.png');
    
    if (this.lastSpawnState === undefined) this.lastSpawnState = 0;
    if (+new Date() - this.lastSpawnState > this.spawnStateDelay) {
      this.spawningTime--;
      this.spawnFrame++;
      if (this.spawnFrame > 3) {
        this.spawnFrame = 0;
      }
      this.lastSpawnState = +new Date();
    }
    
    if (this.spawningTime <= 0) {
      this.isSpawning = false;
    }
    
    screen.drawImage(sprite, 
       0 + (this.size.w * this.spawnFrame), 0, 
       this.size.w, this.size.h, 
       this.position.x, this.position.y, 
       this.size.w, this.size.h
    );
  },
  
  drawName: function (screen) {
    var metrics = screen.measureText('~' + this.name);
    var center = this.position.x + (this.size.w / 2) - (metrics.width / 2);
    
    screen.font = 'bold 10px Arial';
    screen.fillStyle = '#f9c700';
    screen.fillText('~' + this.name, center, this.position.y - 10);
  },
  
  initKeyboarder: function () {
    this.keyboarder = new BattleCity.Keyboarder();
  },
  
  canMoveUp:  function () {
    this.frame = 0;
    this.shouldSync = true;
    return ((this.position.y > 0)  
      && !this.game.map.checkCollision(this.position.x, this.position.y - this.velocity) 
      && !this.game.map.checkCollision(this.position.x + this.size.w, this.position.y - this.velocity)
      && !this.game.map.checkCollision(this.position.x + (this.size.w / 2), this.position.y - this.velocity)
    );
  },
  
  canMoveDown: function () {
    this.frame = 2;
    this.shouldSync = true;
    return (
      (this.position.y + this.size.h < this.game.size.h)
      && !this.game.map.checkCollision(this.position.x, this.position.y + this.size.h + this.velocity) 
      && !this.game.map.checkCollision(this.position.x + this.size.w, this.position.y + this.size.h + this.velocity)
      && !this.game.map.checkCollision(this.position.x + (this.size.w / 2), this.position.y + this.size.h + this.velocity)
    );
  },
  
  canMoveLeft: function () {
    this.frame = 3;
    this.shouldSync = true;
    return (
      (this.position.x > 0)
      && !this.game.map.checkCollision(this.position.x - this.velocity, this.position.y) 
      && !this.game.map.checkCollision(this.position.x - this.velocity, this.position.y + this.size.h)
      && !this.game.map.checkCollision(this.position.x - this.velocity, this.position.y + (this.size.h / 2))
    );
  },
  
  canMoveRight: function () {
    this.frame = 1;
    this.shouldSync = true;
    return (
      (this.position.x + this.size.w < this.game.size.w)
      && !this.game.map.checkCollision(this.position.x + this.size.w + this.velocity, this.position.y) 
      && !this.game.map.checkCollision(this.position.x + this.size.w + this.velocity, this.position.y + this.size.h)
      && !this.game.map.checkCollision(this.position.x + this.size.w + this.velocity, this.position.y + (this.size.h / 2))
    );
  },
  
  canShot: function () {
    if (this.lastShot === undefined) this.lastShot = 0;
    if (+new Date() - this.lastShot > this.shotDelay) {
      this.lastShot = +new Date();
      return true;
    }
    return false
  },
  
  setPosition: function (data) {
    this.position.x = data.x;
    this.position.y = data.y;
    this.frame = data.frame;
    this.isSpawning = data.isSpawning;
  },
  
  toJSON: function () {
    return {
      id: this.id,
      name: this.name,
      frame: this.frame,
      x: this.position.x,
      y: this.position.y,
      isSpawning: this.isSpawning
    };
  },
  
  notify: function () {
    var data = {
      'type': 'player',
      'data': this.toJSON()
    }
    this.game.websocketClient.send(data);
  }
};
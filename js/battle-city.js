(function () {
  'use strict';
  
  var Game = function () {
    var screen = document.getElementById('screen').getContext('2d');
    this.size = {
      w: screen.canvas.width, 
      h: screen.canvas.height
    };
    this.bodies = [].concat(new Player(this));
    
    var self = this;
    var tick = function () {
      self.update();
      self.draw(screen);
      requestAnimationFrame(tick);
    }
    
    tick();
  };
  
  Game.prototype = {
    update: function () {
      for (var i = 0, l = this.bodies.length; i < l; i++) {
        if (this.bodies[i].update !== undefined) {
          this.bodies[i].update(screen);
        }
      }
    },
    
    draw: function (screen) {
      screen.clearRect(0, 0, this.size.w, this.size.h);
      
      for (var i = 0, l = this.bodies.length; i < l; i++) {
        if (this.bodies[i].draw !== undefined) {
          this.bodies[i].draw(screen);
        }
      }
    },
    
    addBody: function (body) {
      this.bodies.push(body);
    },
    
    removeBody: function (body) {
      var bodyIndex = this.bodies.indexOf(body);
      if (bodyIndex !== -1) {
        this.bodies.splice(bodyIndex, 1);
      }
    }
  }
  
  var Player = function (game) {
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
    this.keyboarder = new Keyboarder();
  };
  
  Player.prototype = {
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
        var bullet = new Bullet(
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
  
  var Bullet = function (game, position, velocity) {
    this.game = game;
    this.position = position;
    this.size = {
      w: 2,
      h: 3
    };
    this.velocity = velocity;
  };
  
  Bullet.prototype = {
    update: function () {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    },
    
    draw: function (screen) {
      screen.fillStyle = '#adadad';
      screen.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
    }
  };
  
  var Keyboarder = function () {
    this.keyState = {};
    var self = this;
    
    window.addEventListener('keydown', function (e) {
      self.keyState[e.keyCode] = true
    });
    
    window.addEventListener('keyup', function (e) {
      self.keyState[e.keyCode] = false
    });
  };
  
  Keyboarder.prototype = {
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
  }

  var Client = function () {
    this.connection = new WebSocket('ws://localhost:8080');

    this.connection.onopen = function (e) {
      console.log("Connection established!");
    }

    this.connection.onmessage = function (e) {
      console.log(e.data);
    }
  };
  
  window.addEventListener('load', function () {
    new Game();
  })
  
}());

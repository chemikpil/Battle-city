(function () {
  'use strict';
  
  var Game = function () {
    var screen = document.getElementById('screen').getContext('2d');
    this.size = {
      w: screen.canvas.width, 
      h: screen.canvas.height
    };
    this.bodies = [];
    this.websocketClient = new WebsocketClient(this);
    
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
      for (var i in this.bodies) {
        if (this.bodies[i].isHuman && this.bodies[i].update !== undefined) {
          this.bodies[i].update(screen);
        }
      }
    },
    
    draw: function (screen) {
      screen.clearRect(0, 0, this.size.w, this.size.h);
      
      for (var i in this.bodies) {
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
    this.id = 0;
    this.isHuman = false;
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
        this.notify();
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) && (this.position.x + this.size.w < this.game.size.w)) {
        this.position.x += 2;
        this.frame = 1;
        this.notify();
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) && (this.position.y > 0)) {
        this.position.y -= 2;
        this.frame = 0;
        this.notify();
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN) && (this.position.y + this.size.h < this.game.size.h)) {
        this.position.y += 2;
        this.frame = 2;
        this.notify();
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
    },

    notify: function () {
      this.game.websocketClient.send(
          {
            'type': 'player',
            'data': {
              'id': this.id,
              'frame': this.frame,
              'x': this.position.x,
              'y': this.position.y
            }
          }
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

  var WebsocketClient = function (game) {
    this.game = game;
    this.connection = new WebSocket('ws://localhost:8080');

    var self = this;
    this.connection.onmessage = function (e) {
      //console.log('Receiving: ' + e.data);
      var data = JSON.parse(e.data);
      var messageType = data.type;
      var messageData = data.data;

      if (messageType == 'ID') {
        var player = new Player(self.game);

        player.id = messageData;
        player.isHuman = true;

        self.game.bodies[messageData] = player;

        player.notify();
      }

      else if (messageType == 'player') {
        var player = new Player(self.game);
        player.id = messageData.id;
        player.frame = messageData.frame;
        player.position.x = messageData.x;
        player.position.y = messageData.y;

        self.game.bodies[messageData.id] = player;
      }
    }
  };

  WebsocketClient.prototype = {
    send: function (data) {
      var jsondata = JSON.stringify(data);
      //console.log('Sending: ' + jsondata);
      this.connection.send(jsondata);
    }
  };
  
  window.addEventListener('load', function () {
    new Game();
  })
  
}());

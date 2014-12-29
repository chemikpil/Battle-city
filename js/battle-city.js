(function () {
  'use strict';
  
  var Game = function () {
    var screen = document.getElementById('screen').getContext('2d');
    this.size = {
      x: screen.canvas.width, 
      y: screen.canvas.height
    };
    this.players = [].concat(new Player(this));
    
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
      for (var i = 0, l = this.players.length; i < l; i++) {
        if (this.players[i].update !== undefined) {
          this.players[i].update(screen);
        }
      }
    },
    
    draw: function (screen) {
      screen.clearRect(0, 0, this.size.x, this.size.y);
      
      for (var i = 0, l = this.players.length; i < l; i++) {
        if (this.players[i].draw !== undefined) {
          this.players[i].draw(screen);
        }
      }
    }
  }
  
  var Player = function (game) {
    this.game = game;
    this.position = {
      x: this.game.size.x / 2 - 13, 
      y: this.game.size.y - 30 
    };
    this.size = {
      w: 26,
      h: 26
    };
    this.keyboarder = new Keyboarder();
  };
  
  Player.prototype = {
    update: function () {
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
        this.position.x -= 2;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        this.position.x += 2;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
        this.position.y -= 2;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
        this.position.y += 2;
      }
    },
    
    draw: function (screen) {
      var img = new Image();
      img.src = 'img/sprite.png';
      
      screen.drawImage(img, 0, 18, this.size.w, this.size.h, this.position.x, this.position.y, this.size.w, this.size.h);
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
      DOWN: 40
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

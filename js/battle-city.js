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
  };
  
  Player.prototype = {
    update: function () {
    
    },
    
    draw: function (screen) {
      var img = new Image();
      img.src = 'img/sprite.png';
      
      screen.drawImage(img, 0, 18, this.size.w, this.size.h, this.position.x, this.position.y, this.size.w, this.size.h);
    }
  }
  
  window.addEventListener('load', function () {
    new Game();
  })
  
}());
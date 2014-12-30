var BattleCity = BattleCity || {};

BattleCity.Game = function () {
  var screen = document.getElementById('screen').getContext('2d');
  this.size = {
    w: screen.canvas.width, 
    h: screen.canvas.height
  };
  this.players = [].concat(new BattleCity.Player(this));
  this.websocketClient = new BattleCity.WebsocketClient('ws://localhost:8080', function () {
    
  });
  
  var self = this;
  var tick = function () {
    self.update();
    self.draw(screen);
    requestAnimationFrame(tick);
  }

  tick();
};

BattleCity.Game.prototype = {
  sync: function (id, data) {
    this.players.map(function (player) {
      if (player.id === id) {
        
      }
    });
  },
  
  update: function () {
    var bodies = this.players;
    for (var i = 0, l = bodies.length; i < l; i++) {
      if (bodies[i].update !== undefined) {
        bodies[i].update(screen);
      }
    }
  },

  draw: function (screen) {
    screen.clearRect(0, 0, this.size.w, this.size.h);
    var bodies = this.players;

    for (var i = 0, l = var bodies = this.players;.length; i < l; i++) {
      if (bodies[i].draw !== undefined) {
        bodies[i].draw(screen);
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
};
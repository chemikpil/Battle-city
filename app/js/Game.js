var BattleCity = BattleCity || {};

BattleCity.Game = function () {
  var screen = document.getElementById('screen').getContext('2d');
  this.size = {
    w: screen.canvas.width, 
    h: screen.canvas.height
  };
  this.players = [];

  var self = this;
  var tick = function () {
    self.update();
    self.draw(screen);
    requestAnimationFrame(tick);
  }

  this.websocketClient = new BattleCity.WebsocketClient('ws://localhost:8080', function (message) {
    if (message.type === 'connection') {
      var player = new BattleCity.Player(self, message.data.id);
      player.isOwn = true;
      self.players.push(player);
      tick();
    } else if (message.type === 'player') {
      if (!self.sync(message.data)) {
        var player = new BattleCity.Player(self, message.data.id);
        player.updateFields(message.data);
        self.players.push(player);
      }
    }
  });
};

BattleCity.Game.prototype = {
  sync: function (data) {
    var id = data.id;
    var found = false;
    this.players.map(function (player) {
      if (player.id === id) {
        player.updateFields(data);
        found = true;
      }
    });
    return found;
  },
  
  update: function () {
    var bodies = this.players;
    for (var i = 0, l = bodies.length; i < l; i++) {
      if (bodies[i].update !== undefined && bodies[i].isOwn) {
        bodies[i].update(screen);
      }
    }
  },

  draw: function (screen) {
    screen.clearRect(0, 0, this.size.w, this.size.h);
    var bodies = this.players;

    for (var i = 0, l = bodies.length; i < l; i++) {
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
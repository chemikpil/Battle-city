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
    } else if (message.type === 'hello') {
      var bodies = self.players;
      for (var i = 0, l = bodies.length; i < l; i++) {
        bodies[i].notify();
      }
    } else if (message.type === 'bye') {
      self.removePlayer(message.data.id);
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
      if (bodies[i] !== undefined && bodies[i].update !== undefined && bodies[i].isOwn || bodies[i] instanceof BattleCity.Bullet) {
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
    this.players.push(body);
  },

  removePlayer: function (id) {
    var index = -1;
    for (var i = 0, l = this.players.length; i < l; i++) {
      if (this.players[i].id === id) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      this.players.splice(index, 1);
    }
  },

  removeBullet: function (bullet) {
    var index = this.players.indexOf(bullet);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }
};
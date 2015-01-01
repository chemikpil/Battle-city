var BattleCity = BattleCity || {};

BattleCity.Game = function (name) {
  var screen = document.getElementById('screen').getContext('2d');
  this.size = {
    w: screen.canvas.width, 
    h: screen.canvas.height
  };
  this.assets = new BattleCity.AssetManager();
  this.map = new BattleCity.Map(this);
  this.host = null;
  this.players = [];
  this.bullets = [];
  
  var self = this;
  var fpsContainer = document.getElementById('fps');
  
  var tick = function () {
    self.update();
    self.draw(screen);
    
    fpsContainer.innerHTML = fps.getFPS() + ' fps';
    requestAnimationFrame(tick);
  };
  
  this.websocketClient = new BattleCity.WebsocketClient('ws://localhost:8080', function (message) {
    if (message.type === 'connection') {
      self.host = new BattleCity.Player(self, message.data.id, name);
      self.host.initKeyboarder();
      self.initAssets(function () {
        tick();
      });
    } else if (message.type === 'player') {
      if (!self.sync(message.data)) {
        var player = new BattleCity.Player(self, message.data.id, message.data.name);
        player.setPosition(message.data);
        self.players.push(player);
      }
    } else if (message.type === 'hello') {
      self.host.notify();
    } else if (message.type === 'bye') {
      self.removePlayer(message.data.id);
    } else if (message.type === 'bullet') {
      for (var i = 0, l = self.players.length; i < l; i++) {
        if (self.players[i].id === message.data.id) {
          self.bullets.push(new BattleCity.Bullet(self, self.players[i], message.data.velocity));   
        }
      }
    }
  });
};

BattleCity.Game.prototype = {
  update: function () {
    var bodies = [].concat(this.host).concat(this.bullets);
    
    for (var i = 0, l = bodies.length; i < l; i++) {
      if (bodies[i].update !== undefined) {
        bodies[i].update();
      }
    }
  },
  
  draw: function (screen) {
    screen.clearRect(0, 0, this.size.w, this.size.h);
    
    var bodies = [].concat(this.host).concat(this.players).concat(this.bullets);
    for (var i = 0, l = bodies.length; i < l; i++) {
      if (bodies[i] !== undefined && bodies[i].draw !== undefined) {
        bodies[i].draw(screen);
      }
    }
    
    this.map.draw(screen);
    
    this.host.drawName(screen);
    for (var i = 0, l = this.players.length; i < l; i++) {
      this.players[i].drawName(screen);
    }
  },
  
  sync: function (data) {
    var id = data.id;
    var found = false;
    this.players.map(function (player) {
      if (player.id === id) {
        player.setPosition(data);
        found = true;
      }
    });
    return found;
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
  
  initAssets: function (callback) {
    this.assets.queneDownload('img/map.png');
    this.assets.queneDownload('img/player.png');
    
    this.assets.downloadAll(callback);
  },
  
  addBullet: function (bullet) {
    this.bullets.push(bullet);
  },
  
  removeBullet: function (bullet) {
    var index = this.bullets.indexOf(bullet);
    
    if (index > -1) {
      this.bullets.splice(index, 1);
    }
  }
};
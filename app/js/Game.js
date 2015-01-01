var BattleCity = BattleCity || {};

BattleCity.Game = function (name) {
  var screen = document.getElementById('screen').getContext('2d');
  this.size = {
    w: screen.canvas.width, 
    h: screen.canvas.height
  };
  this.assets = new BattleCity.AssetManager();
  this.map = new BattleCity.Map(this);
  this.host = new BattleCity.Player(this, name);
  this.host.initKeyboarder();
  this.bullets = [];
  
  var self = this;
  var fpsContainer = document.getElementById('fps');
  
  var tick = function () {
    self.update();
    self.draw(screen);
    
    fpsContainer.innerHTML = fps.getFPS() + ' fps';
    requestAnimationFrame(tick);
  }
  
  this.initAssets(function () {
    tick();
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
    
    var bodies = [].concat(this.host).concat(this.bullets);
    for (var i = 0, l = bodies.length; i < l; i++) {
      if (bodies[i].draw !== undefined) {
        bodies[i].draw(screen);
      }
    }
    
    this.map.draw(screen);
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
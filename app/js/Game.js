var BattleCity = BattleCity || {};

BattleCity.Game = function () {
  var screen = document.getElementById('screen').getContext('2d');
  this.size = {
    w: screen.canvas.width, 
    h: screen.canvas.height
  };
  this.assets = new BattleCity.AssetManager();
  this.host = new BattleCity.Player(this);
  this.host.initKeyboarder();
  
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
    var bodies = [].concat(this.host);
    
    for (var i = 0, l = bodies.length; i < l; i++) {
      if (bodies[i].update !== undefined) {
        bodies[i].update();
      }
    }
  },
  
  draw: function (screen) {
    screen.clearRect(0, 0, this.size.w, this.size.h);
    
    var bodies = [].concat(this.host);
    
    for (var i = 0, l = bodies.length; i < l; i++) {
      if (bodies[i].draw !== undefined) {
        bodies[i].draw(screen);
      }
    }
  },
  
  initAssets: function (callback) {
    this.assets.queneDownload('img/map.png');
    this.assets.queneDownload('img/player.png');
    
    this.assets.downloadAll(callback);
  }
};
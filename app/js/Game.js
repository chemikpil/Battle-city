var BattleCity = BattleCity || {};

BattleCity.Game = function () {
  var screen = document.getElementById('screen').getContext('2d');
  this.size = {
    w: screen.canvas.width, 
    h: screen.canvas.height
  };
  this.host = new BattleCity.Player(this);
  
  var self = this;
  var fpsContainer = document.getElementById('fps');
  
  var tick = function () {
    self.update();
    self.draw(screen);
    
    fpsContainer.innerHTML = fps.getFPS() + ' fps';
    requestAnimationFrame(tick);
  }
  tick();
};

BattleCity.Game.prototype = {
  update: function () {
    
  },
  
  draw: function (screen) {
    screen.clearRect(0, 0, this.size.w, this.size.h);
    
    var bodies = [].concat(this.host);
    
    for (var i = 0, l = bodies.length; i < l; i++) {
      if (bodies[i].draw !== undefined) {
        bodies[i].draw(screen);
      }
    }
  }
};
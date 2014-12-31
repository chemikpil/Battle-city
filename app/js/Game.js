var BattleCity = BattleCity || {};

BattleCity.Game = function () {
  var screen = document.getElementById('screen').getContext('2d');
  this.size = {
    w: screen.canvas.width, 
    h: screen.canvas.height
  };
  
  var self = this;
  var fpsContainer = document.getElementById('fps');
  
  
  var tick = function () {
    self.update();
    self.draw();
    
    fpsContainer.innerHTML = fps.getFPS() + ' fps';
    requestAnimationFrame(tick);
  }
  tick();
};

BattleCity.Game.prototype = {
  update: function () {
    
  },
  
  draw: function () {
  
  }
};
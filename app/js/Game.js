var BattleCity = BattleCity || {};

BattleCity.Game = function () {
  var screen = document.getElementById('screen').getContext('2d');
  this.size = {
    w: screen.canvas.width, 
    h: screen.canvas.height
  };
  this.websocketClient = new BattleCity.WebsocketClient('ws://localhost:8080', function () {

  });
  this.bodies = [].concat(new BattleCity.Player(this));

  var self = this;
  var tick = function () {
    self.update();
    self.draw(screen);
    requestAnimationFrame(tick);
  }

  tick();
};

BattleCity.Game.prototype = {
  update: function () {
    for (var i = 0, l = this.bodies.length; i < l; i++) {
      if (this.bodies[i].update !== undefined) {
        this.bodies[i].update(screen);
      }
    }
  },

  draw: function (screen) {
    screen.clearRect(0, 0, this.size.w, this.size.h);

    for (var i = 0, l = this.bodies.length; i < l; i++) {
      if (this.bodies[i].draw !== undefined) {
        this.bodies[i].draw(screen);
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
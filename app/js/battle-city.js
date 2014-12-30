(function () {
  'use strict';
  var Client = function () {
    this.connection = new WebSocket('ws://localhost:8080');

    this.connection.onopen = function (e) {
      console.log("Connection established!");
    }

    this.connection.onmessage = function (e) {
      console.log(e.data);
    }
  };
  
  window.addEventListener('load', function () {
    new BattleCity.Game();
  })
  
}());

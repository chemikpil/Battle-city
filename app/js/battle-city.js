(function () {
  'use strict';
  var form = document.getElementById('welcome-form');
  var welcome = document.getElementById('welcome');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = form.name.value;
    welcome.remove();
    
    new BattleCity.Game(name);
  })
}());

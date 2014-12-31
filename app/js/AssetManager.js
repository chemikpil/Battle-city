/* http://www.html5rocks.com/en/tutorials/games/assetmanager/ */

var BattleCity = BattleCity || {};

BattleCity.AssetManager = function () {
  this.successCount = 0;
  this.errorCount = 0;
  this.cache = {};
  this.downloadQuene = [];
}

BattleCity.AssetManager.prototype = {
  queneDownload: function (path) {
    this.downloadQuene.push(path);
  },
  
  downloadAll: function (callback) {
    var self = this;
    if (this.downloadQuene.length === 0) {
      callback();
    }
    
    for (var i = 0, l = this.downloadQuene.length; i < l; i++) {
      var path = this.downloadQuene[i];
      var img = new Image();
      
      img.addEventListener('load', function () {
        self.successCount++;
        
        if (self.isDone()) {
          callback();
        }
      }, false);
      
      img.addEventListener('error', function () {
        self.errorCount++;
        
        if (self.isDone()) {
          callback();
        }
      }, false);
      
      img.src = path;
      this.cache[path] = img;
    }
  },
  
  isDone: function () {
    return (this.downloadQuene.length === this.successCount + this.errorCount);
  },
  
  getAsset: function (path) {
    return this.cache[path];
  }
}
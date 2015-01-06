var fps = {
  startTime: 0,
  frameNumber: 0,
  
  getFPS: function () {
    this.frameNumber++;
    
    var d = +new Date();
    var currentTime = (d - this.startTime) / 1000;
    var result = Math.floor((this.frameNumber / currentTime));
    
    if (currentTime > 1) {
      this.startTime = +new Date();
      this.frameNumber = 0;
    }
    
    return result;
  }
};

var checkCollision = function (b1, b2) {
  return !(
    b1 === b2 ||
      b1.center.x + b1.size.w / 2 <= b2.center.x - b2.size.w / 2 ||
      b1.center.y + b1.size.h / 2 <= b2.center.y - b2.size.h / 2 ||
      b1.center.x - b1.size.w / 2 >= b2.center.x + b2.size.w / 2 ||
      b1.center.y - b1.size.h / 2 >= b2.center.y + b2.size.h / 2
  );
};
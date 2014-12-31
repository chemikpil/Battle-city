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
}
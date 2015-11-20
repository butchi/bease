Raphael(function(){
  var $canvas = $('.canvas');
  var paper = Raphael($canvas.get(0), 200, 200);

  var ptArr = [
    new Point(0,   0  ),
    new Point(0.2, 0.5),
    new Point(0.8, 0.2),
    new Point(1,   1  )
  ];

  var cb = cubicBezier(0.2, 0.5, 0.8, 0.2);

  var cbPts = [];
  var i;
  var len = 101;
  for(i = 0; i < len; i++) {
    cbPts.push(cb(i / len));
  }
  var curve = new Curve(cbPts);
  // console.log(curve.stringify(2));
  var path = paper.path(curve.stringify(5));
  path.scale(200, -200, 0, 1);

  var circleArr = [];
  ptArr.forEach((elm) => {
    var ptElm = paper.circle(elm.x, elm.y, 0.01)
      .attr({fill:"red",stroke:"none"});
    ptElm.scale(200, -200, 0, 1)
    circleArr.push(ptElm);
  })

  circleArr[1].drag(startDrag, moveDrag, stopDrag);
  circleArr[2].drag(startDrag, moveDrag, stopDrag);

  // paper.path("M10,10L20,30L30,100");
});

function startDrag(dx,dy){
  dx /=  200;
  dy /= -200;
  this.attr("cx", this._cx + dx).attr("cy", this._cy + dy);
}

function moveDrag(){
  this._cx = this.attr("cx");
  this._cy = this.attr("cy");        
}

function stopDrag(){
  delete(this._cx);
  delete(this._cy);
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  stringify(frac) {
    return `${this.x.toFixed(frac)},${this.y.toFixed(frac)}`;
  }

  magnify(k) {
    return new Point(k * this.x, k * this.y);
  }
}

class Curve {
  constructor(pts) {
    this.pts = pts;
  }

  stringify(frac) {
    var ret = '';
    this.pts.forEach((pt, i) => {
      if(i === 0) {
        ret += 'M';
      } else {
        ret += 'L'
      }
      ret += pt.stringify(frac);
    })
    return ret;
  }
}

var curve = new Curve(
  new Point(0, 0),
  new Point(0.2, 0.6),
  new Point(0.8, 0.3),
  new Point(1, 1)
);

function cubicBezier(a, b, c, d) {
  return function(t) {
    return new Point(
      t*t*t + 3*t*t*(1-t)*c + 3*t*(1-t)*(1-t)*a,
      t*t*t + 3*t*t*(1-t)*d + 3*t*(1-t)*(1-t)*b
    );
  };
}

var bease = new Bease({
  func:  'linear',
  array: Bease.easing.easeOutBounce,
});

bease.register('test');

$('.ball').animate({
  top: 100,
}, {
  duration: 1000,
  easing: 'test',
});

var bezier;
var circleArr = [];

Raphael(function(){
  var $canvas = $('.canvas');
  var paper = Raphael($canvas.get(0), 200, 200);

  var defaultParam = {
    a: 0.17,
    b: 0.67,
    c: 0.83,
    d: 0.67,
  }

  var ptArr = [
    new Point(0, 0),
    new Point(defaultParam.a, defaultParam.b),
    new Point(defaultParam.c, defaultParam.d),
    new Point(1, 1)
  ];

  bezier = new CubicBezier(paper);
  bezier.render(defaultParam.a, defaultParam.b, defaultParam.c, defaultParam.d);

  ptArr.forEach((elm) => {
    var ptElm = paper.circle(elm.x, elm.y, 0.02)
      .attr({fill:"red",stroke:"none"});
    ptElm.scale(200, -200, 0, 1)
    circleArr.push(ptElm);
  })

  circleArr[1].drag(moveDrag, startDrag, stopDrag);
  circleArr[2].drag(moveDrag, startDrag, stopDrag);

  // paper.path("M10,10L20,30L30,100");
});

function moveDrag(dx,dy){
  dx /=  200;
  dy /= -200;
  this.attr("cx", this._cx + dx).attr("cy", this._cy + dy);

  var c1 = circleArr[1];
  var c2 = circleArr[2];
  var a = c1.attr('cx');
  var b = c1.attr('cy');
  var c = c2.attr('cx');
  var d = c2.attr('cy');
  bezier.render(a, b, c, d);
}

function startDrag(){
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

class CubicBezier {
  constructor(paper) {
    this.paper = paper;
  }

  cubicBezierFunction(a, b, c, d) {
    return function(t) {
      return new Point(
        t*t*t + 3*t*t*(1-t)*c + 3*t*(1-t)*(1-t)*a,
        t*t*t + 3*t*t*(1-t)*d + 3*t*(1-t)*(1-t)*b
      );
    };
  }

  render(a, b, c, d) {
    var cb = this.cubicBezierFunction(a, b, c, d);

    var cbPts = [];
    var i;
    var len = 101;
    for(i = 0; i < len; i++) {
      cbPts.push(cb(i / len));
    }
    var curve = new Curve(cbPts);
    // console.log(curve.stringify(2));

    if(this.path) {
      this.path.remove();
    }
    this.path = this.paper.path(curve.stringify(5));
    this.path.scale(200, -200, 0, 1);
  }
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

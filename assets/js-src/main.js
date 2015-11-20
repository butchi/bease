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

class Polyline {
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
    var paper = this.paper;

    var cb = this.cubicBezierFunction(a, b, c, d);

    var cbPts = [];
    var i;
    var len = 101;
    for(i = 0; i < len; i++) {
      cbPts.push(cb(i / len));
    }
    var cbPolyline = new Polyline(cbPts);
    // console.log(polyline.stringify(2));

    this.path && this.path.remove();
    this.path = paper.path(cbPolyline.stringify(5)).attr('stroke-width', 2);
    this.path.scale(200, -200, 0, 1);

    var outputPtArr = this.convertToArr(a, b, c, d, ARR_LEN, SCAN_LEN);
    var previewPts = [];
    console.log(outputPtArr);
    outputPtArr.forEach((val, i) => {
      console.log(i/(outputPtArr.length - 1), val);
      previewPts.push(new Point(i / ARR_LEN, val));
    });

    this.previewPath && this.previewPath.remove();
    this.previewPolyline = new Polyline(previewPts);
    // console.log(this.previewPolyline.stringify(2));
    this.previewPath = paper.path(this.previewPolyline.stringify(10)).scale(200, -200, 0, 1);
  }

  convertToArr(a, b, c, d, len = 11, scanLen = 100) {
    var cb = this.cubicBezierFunction(a, b, c, d);

    var arr = [];
    var tempArr = [];
    var i;
    for(i = 0; i < scanLen; i++) {
      tempArr.push(cb(i / scanLen));
    }
    var group = _.groupBy(tempArr, (pt) => {
      return Math.floor((len - 1) * pt.x);
    });
    // console.log(group);

    var ret = [];

    _.forEach(group, (arr, i) => {
      function sum(ptArr) {
        var result = _.reduce(ptArr, (memo, pt) => {
          return memo +  pt.y;
        }, 0);

        return result;
      }

      var sumVal = sum(arr);
      ret[i] = sumVal / arr.length;
    });

    ret[0] = cb(0).y;
    ret.push(cb(1).y);

    return ret;
  }
}

var ARR_LEN  = 6;
var SCAN_LEN = 10;
var bezier;
// var defaultParam = {
//   a: 0.17,
//   b: 0.67,
//   c: 0.83,
//   d: 0.67,
// }
var defaultParam = {
  a: 0.1,
  b: 0.1,
  c: 0.9,
  d: 0.9,
}

var ptArr = [
  new Point(0, 0),
  new Point(defaultParam.a, defaultParam.b),
  new Point(defaultParam.c, defaultParam.d),
  new Point(1, 1)
];
var circleArr = [];

var line1;
var line2;

Raphael.fn.line = function (pt1, pt2) {
    return this.path(Raphael.format("M{0},{1} {2},{3}", pt1.x, pt1.y, pt2.x, pt2.y)).attr('stroke-width', 1).scale(200, -200, 0, 1);
};

Raphael(function(){
  var $canvas = $('.canvas');
  var paper = Raphael($canvas.get(0), 200, 200);

  bezier = new CubicBezier(paper);
  bezier.render(defaultParam.a, defaultParam.b, defaultParam.c, defaultParam.d);

  ptArr.forEach((elm) => {
    var ptElm = paper.circle(elm.x, elm.y, 0.02)
      .attr({fill:"red",stroke:"none"});
    ptElm.scale(200, -200, 0, 1)
    circleArr.push(ptElm);
  });

  line1 = paper.line(new Point(0, 0), new Point(defaultParam.a, defaultParam.b));
  line2 = paper.line(new Point(defaultParam.c, defaultParam.d), new Point(1, 1));
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

  line1.remove();
  line2.remove();
  line1 = this.paper.line(new Point(0, 0), new Point(a, b));
  line2 = this.paper.line(new Point(c, d), new Point(1, 1));
}

function startDrag(){
  this._cx = this.attr("cx");
  this._cy = this.attr("cy");        
}

function stopDrag(){
  delete(this._cx);
  delete(this._cy);
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

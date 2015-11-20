'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = (function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: 'stringify',
    value: function stringify(frac) {
      return this.x.toFixed(frac) + ',' + this.y.toFixed(frac);
    }
  }, {
    key: 'magnify',
    value: function magnify(k) {
      return new Point(k * this.x, k * this.y);
    }
  }]);

  return Point;
})();

var Curve = (function () {
  function Curve(pts) {
    _classCallCheck(this, Curve);

    this.pts = pts;
  }

  _createClass(Curve, [{
    key: 'stringify',
    value: function stringify(frac) {
      var ret = '';
      this.pts.forEach(function (pt, i) {
        if (i === 0) {
          ret += 'M';
        } else {
          ret += 'L';
        }
        ret += pt.stringify(frac);
      });
      return ret;
    }
  }]);

  return Curve;
})();

var CubicBezier = (function () {
  function CubicBezier(paper) {
    _classCallCheck(this, CubicBezier);

    this.paper = paper;
  }

  _createClass(CubicBezier, [{
    key: 'cubicBezierFunction',
    value: function cubicBezierFunction(a, b, c, d) {
      return function (t) {
        return new Point(t * t * t + 3 * t * t * (1 - t) * c + 3 * t * (1 - t) * (1 - t) * a, t * t * t + 3 * t * t * (1 - t) * d + 3 * t * (1 - t) * (1 - t) * b);
      };
    }
  }, {
    key: 'render',
    value: function render(a, b, c, d) {
      var cb = this.cubicBezierFunction(a, b, c, d);

      var cbPts = [];
      var i;
      var len = 101;
      for (i = 0; i < len; i++) {
        cbPts.push(cb(i / len));
      }
      var curve = new Curve(cbPts);
      // console.log(curve.stringify(2));

      this.path && this.path.remove();
      this.path = this.paper.path(curve.stringify(5)).attr('stroke-width', 2);
      this.path.scale(200, -200, 0, 1);
    }
  }]);

  return CubicBezier;
})();

var bezier;
var defaultParam = {
  a: 0.17,
  b: 0.67,
  c: 0.83,
  d: 0.67
};

var ptArr = [new Point(0, 0), new Point(defaultParam.a, defaultParam.b), new Point(defaultParam.c, defaultParam.d), new Point(1, 1)];
var circleArr = [];

var line1;
var line2;

Raphael.fn.line = function (pt1, pt2) {
  return this.path(Raphael.format("M{0},{1} {2},{3}", pt1.x, pt1.y, pt2.x, pt2.y)).attr('stroke-width', 1).scale(200, -200, 0, 1);
};

Raphael(function () {
  var $canvas = $('.canvas');
  var paper = Raphael($canvas.get(0), 200, 200);

  bezier = new CubicBezier(paper);
  bezier.render(defaultParam.a, defaultParam.b, defaultParam.c, defaultParam.d);

  ptArr.forEach(function (elm) {
    var ptElm = paper.circle(elm.x, elm.y, 0.02).attr({ fill: "red", stroke: "none" });
    ptElm.scale(200, -200, 0, 1);
    circleArr.push(ptElm);
  });

  line1 = paper.line(new Point(0, 0), new Point(defaultParam.a, defaultParam.b));
  line2 = paper.line(new Point(defaultParam.c, defaultParam.d), new Point(1, 1));
  circleArr[1].drag(moveDrag, startDrag, stopDrag);
  circleArr[2].drag(moveDrag, startDrag, stopDrag);

  // paper.path("M10,10L20,30L30,100");
});

function moveDrag(dx, dy) {
  dx /= 200;
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

function startDrag() {
  this._cx = this.attr("cx");
  this._cy = this.attr("cy");
}

function stopDrag() {
  delete this._cx;
  delete this._cy;
}

var bease = new Bease({
  func: 'linear',
  array: Bease.easing.easeOutBounce
});

bease.register('test');

$('.ball').animate({
  top: 100
}, {
  duration: 1000,
  easing: 'test'
});
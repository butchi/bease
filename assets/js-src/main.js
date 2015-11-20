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
    this.path = paper.path(cbPolyline.stringify(5)).attr('stroke-width', 5).attr('stroke', '#ccc');
    this.path.scale(200, -200, 0, 1);



    outputPtArr = this.convertToArr(a, b, c, d, ARR_LEN, SCAN_LEN);
    bease.array = outputPtArr;

    var previewPts = [];
    var func = bease.getFunc();
    // console.log(outputPtArr);
    _.range(0, 1, 1/200).forEach((x) => {
      // console.log(i/(outputPtArr.length - 1), val);
      previewPts.push(new Point(x, func(x)));
    });

    this.previewPath && this.previewPath.remove();
    this.previewPolyline = new Polyline(previewPts);
    // console.log(this.previewPolyline.stringify(2));
    this.previewPath = paper.path(this.previewPolyline.stringify(10)).scale(200, -200, 0, 1);

    $('.output-arr').text(`[${outputPtArr}]`);

    var compile = _.template(
`var bease = new Bease({
  fill:  'linear',
  array: [<%= arr %>],
});

bease.register('myease');

var $elm = $('.element-will-be-animated');
$elm.animate({
  left: 200,
}, {
  duration: 1000,
  easing:   'myease',
});
`
    );

    $('.sample-code').text(compile({
      arr: outputPtArr,
    }));
  }

  convertToArr(a, b, c, d, len = 11, scanLen = 100) {
    // from [jQuery - \[javascript\]配列から最も近い値を探す - Qiita](http://qiita.com/shuuuuun/items/f0031d710ca50b21177a)
    function nearestIndex(arr, x) {
      var diff = [];
      var index = 0;

      arr.forEach((val, i) => {
        diff[i] = Math.abs(x - val);
        index = (diff[index] < diff[i]) ? index : i;
      });

      return index;
    }

    var cb = this.cubicBezierFunction(a, b, c, d);

    var xArr = [];
    var yArr = [];
    var tArr = _.range(0, 1, 1 / scanLen)

    tArr.forEach((t) => {
      xArr.push(cb(t).x);
      yArr.push(cb(t).y);
    });

    var idxArr = _.range(len - 1);
    var ret = _.map(idxArr, (idx) => {
      var nearIdx = nearestIndex(xArr, idx / (len - 1));
      return yArr[nearIdx].toFixed(3);
    });

    ret.push(cb(1).y.toFixed(3));
    // console.log(ret);

    return ret;
  }
}

var Event = {
  START_ANIM: 'startanim',
}
var ARR_LEN  = 11;
var SCAN_LEN = 100;
var bezier;
var defaultParam = {
  a: 0.17,
  b: 0.67,
  c: 0.83,
  d: 0.67,
};

var ptArr = [
  new Point(0, 0),
  new Point(defaultParam.a, defaultParam.b),
  new Point(defaultParam.c, defaultParam.d),
  new Point(1, 1)
];
var circleArr = [];
var outputPtArr;

var line1;
var line2;

var bease = new Bease({
  fill:  'linear',
  array: null,
});

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

$('.btn-preview').on('click', function() {
  $('.anim-elm').trigger(Event.START_ANIM);
});

$('.anim-elm').on(Event.START_ANIM, function() {
  var $this = $(this);
  clearTimeout($this.data('timerId'));
  bease.register('slide');

  var dist = {};

  if(false) {
  } else if($this.is('.anim-elm--slide')) {
    dist = {
      left: 200,
    };
  } else if($this.is('.anim-elm--fade')) {
    dist = {
      opacity: 1,
    };
  }

  $this
    .stop(true, true)
    .attr('style', '')
    .animate(dist, {
      duration: 1000,
      easing:   'slide',
      complete: function() {
        var timerId = setTimeout(() => {
          $this.attr('style', '');
        }, 2000);
        $this.data('timerId', timerId);
      }
  });
});

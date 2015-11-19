var UNIT_WIDTH = 100;
var UNIT_HEIGHT = 100;
var PANEL_WIDTH  = 200;
var PANEL_HEIGHT = 200;

$(function() {

  var $elm = $('.wave-canvas');
  var stage = new createjs.Stage($elm.get(0));

  var panel = new createjs.Container();
  panel.width  =   UNIT_WIDTH;
  panel.height =   UNIT_HEIGHT;
  panel.scaleX =   PANEL_WIDTH / UNIT_WIDTH;
  panel.scaleY = - PANEL_HEIGHT / UNIT_HEIGHT;
  panel.x = 10;
  panel.y = 250;
  stage.addChild(panel);


  var gridBitmap;
  var file = "./assets/img/grid.png";
  var gridLoader = new createjs.ImageLoader(file);
  gridLoader.addEventListener("complete", function() {
    var gridImage = gridBitmap.image;
    gridBitmap.regX = 0;
    gridBitmap.regY = 0;
    gridBitmap.scaleX = UNIT_WIDTH / gridBitmap.image.width;
    gridBitmap.scaleY = UNIT_HEIGHT / gridBitmap.image.height;
    stage.update();
  });
  gridLoader.load();
  gridBitmap = new createjs.Bitmap(file);
  panel.addChild(gridBitmap);

  var pt1 = new Pt(0,   0,   3);
  var pt2 = new Pt(0.2, 0.4, 3);
  var pt3 = new Pt(0.8, 0.5, 3);
  var pt4 = new Pt(1,   1,   3);
  panel.addChild(pt1.shape);
  panel.addChild(pt2.shape);
  panel.addChild(pt3.shape);
  panel.addChild(pt4.shape);

  var curve = new createjs.Shape();
  curve.graphics.setStrokeStyle(1)
  .beginStroke('#000000')
  .moveTo(pt1.x * UNIT_WIDTH, pt1.y * UNIT_HEIGHT)
  .bezierCurveTo(pt2.x * UNIT_WIDTH, pt2.y * UNIT_HEIGHT, pt3.x * UNIT_WIDTH, pt3.y * UNIT_HEIGHT, pt4.x * UNIT_WIDTH, pt4.y * UNIT_HEIGHT)
  .endStroke();

  panel.addChild(curve);

  stage.update();
});

function Pt(x, y, size) {
  var shape = new createjs.Shape();
    shape.x = x * UNIT_WIDTH;
    shape.y = y * UNIT_HEIGHT;
    shape.graphics
      .beginFill("black")
      .drawCircle(0, 0, size);

  this.x = x;
  this.y = y;
  this.shape = shape;
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

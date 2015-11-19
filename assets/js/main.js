function plot(imin, imax, di) {
  var func = bease.getFunc();
  var pts = "";
  //pts = "50,375 150,375 150,325 250,325 250,375 350,375 350,250 450,250 450,375 550,375 550,175 650,175 650,375 750,375 750,100 850,100 850,375 950,375 950,25 1050,25 1050,375 1150,375";
  var i;
  for(i = imin; i < imax; i += di) {
    //pts += (i*100).toFixed(3) +"," + (f(i)*500).toFixed(3) + " ";
    pts += (i * 100).toFixed(3) + "," + (func(i) * 100).toFixed(3) + " ";
  }
  document.getElementById('graph1').setAttribute('points', pts);
}

var bease = new Bease({
  func:  'linear',
  array: Bease.easing.easeOutBounce,
});
plot(-5 ,5, 0.01);

bease.register('test');

$('.ball').animate({
  top: 100,
}, {
  duration: 1000,
  easing: 'test',
});

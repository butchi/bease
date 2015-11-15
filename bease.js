"use strict";
function bease(arr, type) {
  return function(x) {
    interpolate(arr, type.func, x);
  };
}

function interpolate(arr, f, x) {
  var ret = 0;
  var i;
  for(i=0; i<arr.length; i++) {
    ret += f((arr.length-1)*x-i)*arr[i];
  }
  //if(x>-0.001 && x<0.001) ret = 50;
  //if(x>0.999 && x<1.001) ret = 50;
  //console.log(x, ret);
  return ret;
}


/*
 * �z��̗v�f��undefined�̂Ƃ���0��Ԃ��֐�
 */
function comb(arr, x) {
  if(typeof arr[x] === 'undefined') {
    return 0;
  } else {
    return arr[x];
  }
}

/*
 * nearest neighbor
 */
function nn(x) {
  if(x>-0.5 && x<0.5) {
    return 1;
  } else if(x===0.5 || x===-0.5) { //�O�̂���
    return 0.5;
  } else {
    return 0;
  }
}

function linear(x) {
  if(x>0) {
    if(x>1) {
      return 0;
    } else {
      return 1-x;
    }
  } else {
    if(x<-1) {
      return 0;
    } else {
      return x+1;
    }
  }
}

/*
 * from http://ja.wikipedia.org/wiki/%E5%86%85%E6%8C%BF
 * from �u�R���s���[�^�摜�����v�c���G�s�Ғ�
 */
function cubic(x, a) {
  if(typeof a === 'undefined') {
    a=-1;
  }
  if(x<0) {
    x=-x;
  }
  if(x<1) {
    return (a+2)*x*x*x - (a+3)*x*x + 1;
  } else if(x<2) {
    return a*x*x*x - 5*a*x*x + 8*a*x - 4*a;
  } else {
    return 0;
  }
}

function sinc(x) {
  if(x===0) {
    return 1;
  } else if(x===~~x) { // 0�ȊO�̐����̂Ƃ�
    return 0;
  } else {
    var x2 = x*Math.PI;
    return Math.sin(x2)/x2;
  }
}

function cosPulse(x) {
  if(x>=1 || x<=-1) {
    return 0;
  } else {
    return 1+Math.cos(x*Math.PI);
  }
}

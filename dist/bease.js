'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var Bease = (function () {
    function Bease(option) {
      _classCallCheck(this, Bease);

      this._arr = option.array || [0, 1];
      this._func = option.func || 'linear';
    }

    _createClass(Bease, [{
      key: 'getFunc',
      value: function getFunc() {
        var arr = this._arr;
        var func;
        if (false) {} else if (typeof this._func === 'string') {
          func = Bease.InterpolationFunction[this._func];
          if (!func) {
            throw new Error('補間関数がありません。');
          }
        } else if (typeof this._func === 'function') {
          func = this._func;
        } else {
          throw new Error('funcオプションには補間関数名か関数を入力してください。');
        }

        return function (x) {
          return interpolate(arr, func, x);
        };
      }
    }, {
      key: 'func',
      value: function func(x) {
        return this.getFunc()(x);
      }
    }, {
      key: 'register',
      value: function register(name) {
        if (window.jQuery) {
          if (name == null) {
            var date = new Date();
            var uid = date.valueOf().toString();
            name = uid;
          }
          jQuery.easing[name] = this.getFunc();
          return name;
        } else {
          throw new Error('この関数はjQueryを有効にした上で呼び出してください。');
        }
      }
    }]);

    return Bease;
  })();

  function interpolate(arr, f, x) {
    var ret = 0;
    var i;
    for (i = 0; i < arr.length; i++) {
      ret += f((arr.length - 1) * x - i) * arr[i];
    }
    return ret;
  }

  /*
   * くし型関数（配列の要素がundefinedのときに0を返す関数）
   */
  function comb(arr, x) {
    if (typeof arr[x] === 'undefined') {
      return 0;
    } else {
      return arr[x];
    }
  }

  /*
   * nearest neighbor（最近傍）
   */
  function nn(x) {
    if (x > -0.5 && x < 0.5) {
      return 1;
    } else if (x === 0.5 || x === -0.5) {
      //念のため
      return 0.5;
    } else {
      return 0;
    }
  }

  /*
   * 線形補間
   */
  function linear(x) {
    if (x > 0) {
      if (x > 1) {
        return 0;
      } else {
        return 1 - x;
      }
    } else {
      if (x < -1) {
        return 0;
      } else {
        return x + 1;
      }
    }
  }

  /*
   * キュービックコンボリューション
   * from http://ja.wikipedia.org/wiki/%E5%86%85%E6%8C%BF
   * from 「コンピュータ画像処理」田村秀行編著
   */
  function cubic(x, a) {
    if (typeof a === 'undefined') {
      a = -1;
    }
    if (x < 0) {
      x = -x;
    }
    if (x < 1) {
      return (a + 2) * x * x * x - (a + 3) * x * x + 1;
    } else if (x < 2) {
      return a * x * x * x - 5 * a * x * x + 8 * a * x - 4 * a;
    } else {
      return 0;
    }
  }

  /*
   * Sinc補間
   */
  function sinc(x) {
    if (x === 0) {
      return 1;
    } else if (x === ~ ~x) {
      // 0以外の整数のとき
      return 0;
    } else {
      var x2 = x * Math.PI;
      return Math.sin(x2) / x2;
    }
  }

  /*
   * Cos関数のパルス波による補間
   */
  function cosPulse(x) {
    if (x >= 1 || x <= -1) {
      return 0;
    } else {
      return (1 + Math.cos(x * Math.PI)) / 2;
    }
  }

  Bease.InterpolationFunction = {
    comb: comb,
    nn: nn,
    linear: linear,
    cubic: cubic,
    sinc: sinc,
    cosPulse: cosPulse
  };

  // from /generator/index.html
  Bease.easing = { "linear": ["0.000", "0.050", "0.100", "0.150", "0.200", "0.250", "0.300", "0.350", "0.400", "0.450", "0.500", "0.550", "0.600", "0.650", "0.700", "0.750", "0.800", "0.850", "0.900", "0.950", "1.000"], "swing": ["0.000", "0.098", "0.190", "0.278", "0.360", "0.438", "0.510", "0.577", "0.640", "0.698", "0.750", "0.797", "0.840", "0.878", "0.910", "0.938", "0.960", "0.977", "0.990", "0.997", "1.000"], "jswing": ["0.000", "0.006", "0.024", "0.054", "0.095", "0.146", "0.206", "0.273", "0.345", "0.422", "0.500", "0.578", "0.655", "0.727", "0.794", "0.854", "0.905", "0.946", "0.976", "0.994", "1.000"], "easeInQuad": ["0.000", "0.003", "0.010", "0.022", "0.040", "0.063", "0.090", "0.122", "0.160", "0.203", "0.250", "0.303", "0.360", "0.423", "0.490", "0.563", "0.640", "0.722", "0.810", "0.902", "1.000"], "easeOutQuad": ["0.000", "0.098", "0.190", "0.278", "0.360", "0.438", "0.510", "0.577", "0.640", "0.698", "0.750", "0.797", "0.840", "0.878", "0.910", "0.938", "0.960", "0.977", "0.990", "0.997", "1.000"], "easeInOutQuad": ["0.000", "0.005", "0.020", "0.045", "0.080", "0.125", "0.180", "0.245", "0.320", "0.405", "0.500", "0.595", "0.680", "0.755", "0.820", "0.875", "0.920", "0.955", "0.980", "0.995", "1.000"], "easeInCubic": ["0.000", "0.000", "0.001", "0.003", "0.008", "0.016", "0.027", "0.043", "0.064", "0.091", "0.125", "0.166", "0.216", "0.275", "0.343", "0.422", "0.512", "0.614", "0.729", "0.857", "1.000"], "easeOutCubic": ["0.000", "0.143", "0.271", "0.386", "0.488", "0.578", "0.657", "0.725", "0.784", "0.834", "0.875", "0.909", "0.936", "0.957", "0.973", "0.984", "0.992", "0.997", "0.999", "1.000", "1.000"], "easeInOutCubic": ["0.000", "0.001", "0.004", "0.013", "0.032", "0.063", "0.108", "0.171", "0.256", "0.365", "0.500", "0.636", "0.744", "0.829", "0.892", "0.938", "0.968", "0.987", "0.996", "0.999", "1.000"], "easeInQuart": ["0.000", "0.000", "0.000", "0.001", "0.002", "0.004", "0.008", "0.015", "0.026", "0.041", "0.063", "0.092", "0.130", "0.179", "0.240", "0.316", "0.410", "0.522", "0.656", "0.815", "1.000"], "easeOutQuart": ["0.000", "0.185", "0.344", "0.478", "0.590", "0.684", "0.760", "0.821", "0.870", "0.908", "0.938", "0.959", "0.974", "0.985", "0.992", "0.996", "0.998", "0.999", "1.000", "1.000", "1.000"], "easeInOutQuart": ["0.000", "0.000", "0.001", "0.004", "0.013", "0.031", "0.065", "0.120", "0.205", "0.328", "0.500", "0.672", "0.795", "0.880", "0.935", "0.969", "0.987", "0.996", "0.999", "1.000", "1.000"], "easeInQuint": ["0.000", "0.000", "0.000", "0.000", "0.000", "0.001", "0.002", "0.005", "0.010", "0.018", "0.031", "0.050", "0.078", "0.116", "0.168", "0.237", "0.328", "0.444", "0.590", "0.774", "1.000"], "easeOutQuint": ["0.000", "0.226", "0.410", "0.556", "0.672", "0.763", "0.832", "0.884", "0.922", "0.950", "0.969", "0.982", "0.990", "0.995", "0.998", "0.999", "1.000", "1.000", "1.000", "1.000", "1.000"], "easeInOutQuint": ["0.000", "0.000", "0.000", "0.001", "0.005", "0.016", "0.039", "0.084", "0.164", "0.295", "0.500", "0.705", "0.836", "0.916", "0.961", "0.984", "0.995", "0.999", "1.000", "1.000", "1.000"], "easeInSine": ["0.000", "0.003", "0.012", "0.028", "0.049", "0.076", "0.109", "0.147", "0.191", "0.240", "0.293", "0.351", "0.412", "0.478", "0.546", "0.617", "0.691", "0.767", "0.844", "0.922", "1.000"], "easeOutSine": ["0.000", "0.078", "0.156", "0.233", "0.309", "0.383", "0.454", "0.522", "0.588", "0.649", "0.707", "0.760", "0.809", "0.853", "0.891", "0.924", "0.951", "0.972", "0.988", "0.997", "1.000"], "easeInOutSine": ["0.000", "0.006", "0.024", "0.054", "0.095", "0.146", "0.206", "0.273", "0.345", "0.422", "0.500", "0.578", "0.655", "0.727", "0.794", "0.854", "0.905", "0.946", "0.976", "0.994", "1.000"], "easeInExpo": ["0.000", "0.001", "0.002", "0.003", "0.004", "0.006", "0.008", "0.011", "0.016", "0.022", "0.031", "0.044", "0.063", "0.088", "0.125", "0.177", "0.250", "0.354", "0.500", "0.707", "1.000"], "easeOutExpo": ["0.000", "0.293", "0.500", "0.646", "0.750", "0.823", "0.875", "0.912", "0.938", "0.956", "0.969", "0.978", "0.984", "0.989", "0.992", "0.994", "0.996", "0.997", "0.998", "0.999", "1.000"], "easeInOutExpo": ["0.000", "0.001", "0.002", "0.004", "0.008", "0.016", "0.031", "0.062", "0.125", "0.250", "0.500", "0.750", "0.875", "0.938", "0.969", "0.984", "0.992", "0.996", "0.998", "0.999", "1.000"], "easeInCirc": ["0.000", "0.001", "0.005", "0.011", "0.020", "0.032", "0.046", "0.063", "0.083", "0.107", "0.134", "0.165", "0.200", "0.240", "0.286", "0.339", "0.400", "0.473", "0.564", "0.688", "1.000"], "easeOutCirc": ["0.000", "0.312", "0.436", "0.527", "0.600", "0.661", "0.714", "0.760", "0.800", "0.835", "0.866", "0.893", "0.917", "0.937", "0.954", "0.968", "0.980", "0.989", "0.995", "0.999", "1.000"], "easeInOutCirc": ["0.000", "0.003", "0.010", "0.023", "0.042", "0.067", "0.100", "0.143", "0.200", "0.282", "0.500", "0.718", "0.800", "0.857", "0.900", "0.933", "0.958", "0.977", "0.990", "0.997", "1.000"], "easeInElastic": ["0.000", "0.001", "0.002", "0.001", "-0.002", "-0.006", "-0.004", "0.006", "0.016", "0.011", "-0.016", "-0.044", "-0.031", "0.044", "0.125", "0.088", "-0.125", "-0.354", "-0.250", "0.354", "1.000"], "easeOutElastic": ["0.000", "0.646", "1.250", "1.354", "1.125", "0.912", "0.875", "0.956", "1.031", "1.044", "1.016", "0.989", "0.984", "0.994", "1.004", "1.006", "1.002", "0.999", "0.998", "0.999", "1.000"], "easeInOutElastic": ["0.000", "0.001", "0.000", "-0.004", "-0.004", "0.012", "0.024", "-0.031", "-0.117", "0.043", "0.500", "0.957", "1.117", "1.031", "0.976", "0.988", "1.004", "1.004", "1.000", "0.999", "1.000"], "easeInBack": ["0.000", "-0.004", "-0.014", "-0.029", "-0.046", "-0.064", "-0.080", "-0.093", "-0.099", "-0.098", "-0.088", "-0.065", "-0.029", "0.023", "0.093", "0.183", "0.294", "0.430", "0.591", "0.781", "1.000"], "easeOutBack": ["0.000", "0.219", "0.409", "0.570", "0.706", "0.817", "0.907", "0.977", "1.029", "1.065", "1.088", "1.098", "1.099", "1.093", "1.080", "1.064", "1.046", "1.029", "1.014", "1.004", "1.000"], "easeInOutBack": ["0.000", "-0.011", "-0.038", "-0.068", "-0.093", "-0.100", "-0.079", "-0.019", "0.090", "0.259", "0.500", "0.741", "0.910", "1.019", "1.079", "1.100", "1.093", "1.068", "1.038", "1.011", "1.000"], "easeInBounce": ["0.000", "0.015", "0.012", "0.055", "0.060", "0.027", "0.069", "0.167", "0.228", "0.250", "0.234", "0.181", "0.090", "0.074", "0.319", "0.527", "0.698", "0.830", "0.924", "0.981", "1.000"], "easeOutBounce": ["0.000", "0.019", "0.076", "0.170", "0.303", "0.473", "0.681", "0.926", "0.910", "0.819", "0.766", "0.750", "0.772", "0.833", "0.931", "0.973", "0.940", "0.945", "0.988", "0.985", "1.000"], "easeInOutBounce": ["0.000", "0.006", "0.030", "0.035", "0.114", "0.117", "0.045", "0.160", "0.349", "0.462", "0.500", "0.538", "0.651", "0.840", "0.955", "0.883", "0.886", "0.965", "0.970", "0.994", "1.000"] };

  // export
  window.Bease = Bease;
})();
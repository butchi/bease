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

  // export
  window.Bease = Bease;
})();
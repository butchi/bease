# bease

## 概要
beaseは柔軟なカスタマイズが可能なイージングライブラリです。

jQueryアニメーションが簡単に行える他、生成した関数を自由に利用できます。

jquery.easingに登録されている[標準的なイージング](http://easings.net/ja)にも対応しています。

## インストール
```
bower install bease
```

もしくは[こちら](http://butchi.github.io/bease/dist/bease.js)からダウンロード

```html
<body>
...

<script src="jquery.js"></script> <!-- jQueryアニメーション使用のときのみ必要 -->
<script src="bease.js"></script>
</body>
```

## 使い方
### jQueryアニメーション
```js
var bease = new Bease({
  fill:  'linear',
  array: [0.000,0.245,0.393,0.490,0.564,0.628,0.685,0.739,0.799,0.878,1.000],
});

bease.register('myease');

var $elm = $('.element-will-be-animated');
$elm.animate({
  left: 200,
}, {
  duration: 1000,
  easing:   'myease',
});
```

### jQueryアニメーション（ショート）
```js
var $elm = $('.element-will-be-animated');
$elm.animate({
  left: 200,
}, {
  duration: 1000,
  easing: (new Bease({array: [0.000,0.245,0.393,0.490,0.564,0.628,0.685,0.739,0.799,0.878,1.000]})).register(),
});
```

### jQueryアニメーション（プリセット）
```js
var bease = new Bease({
  fill:  'linear',
  array: Bease.easing.easeOutBounce,
});

bease.register('easeOutBounce');

var $elm = $('.element-will-be-animated');
$elm.animate({
  top: 200,
}, {
  duration: 1000,
  easing: 'easeOutBounce',
});
```

### イージング関数の取得
```js
var bease = new Bease({
  fill:  'linear',
  array: [0.000,0.245,0.393,0.490,0.564,0.628,0.685,0.739,0.799,0.878,1.000],
});

var f = bease.getFunc();
console.log(f(0), f(0.5), f(1));
```

## カスタマイズ
イージング関数は波形を配列として定義することによって生成されます。

配列を手入力するのは困難なので、編集ページも用意してあります。

[bease wave editor](http://butchi.github.io/bease/)でイージング関数の編集が行えます（※現在三次ベジェ曲線（cubic-bezier）のみ対応）。

# newRead
line-heightで出来た余白をなくし、純粋なmarginを設定するScssのmixin

## Description

line-heightで発生する一番上の行と下の行の余白をなくすためのmarginを設定するものです。

## Usage

lh-marginremove($base-fontsize,$font-size,$va,$base-margin)
というmixinで使っています。
$font-size:適用させたい要素のフォントサイズ、
$va:デザインカンプの行送りの設定値
$base-margin:設定したいmargin

これらを

”.top p,.bottom p{
    @include lh-marginremove(16px,30,40px);
}
”
のように設定すると、ブラウザの見た目で40pxのmargin-top,margin-bottomが出力されます。


## Install
Gulp環境でコンパイルしているので、Gulpの環境を設定した上で、
_mixin.scssをインポート設定したScssファイルでお試しください。
こちらの環境はSrc→Distに吐き出しています。



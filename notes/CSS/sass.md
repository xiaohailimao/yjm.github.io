# Dart-Sass
## Syntax 语法
### Comments 注释
```scss
// 单行注释
```
```scss
/* 
多行注释
*/
```
```scss
/*! 即使在压缩模式下，也将包含此注释。 */

```
```scss
// 文档说明注释
/// Computes an exponent.
///
/// @param {number} $base
///   The number to multiply by itself.
/// @param {integer (unitless)} $exponent
///   The number of `$base`s to multiply together.
/// @return {number} `$base` to the power of `$exponent`.
@function pow($base, $exponent) {
  $result: 1;
  @for $_ from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}
```
### Special Functions 特殊功能
#### url()
url()函数是css中的常用函数，但是其语法与其他函数不同，它可以使用带引号或者不带引号的URL。由于未带引号的URL不是有效的sassScript表达式，所以sass需要特殊的逻辑进行解析处理

如果url()的参数是有效的未带引号的URL，则sass会按原样解析它，否则将其解析为普通的css函数调用

```scss
$roboto-font-path: "../fonts/roboto";

@font-face {
    // 这被解析为采用带引号的字符串的普通函数调用
    src: url("#{$roboto-font-path}/Roboto-Thin.woff2") format("woff2");

    font-family: "Roboto";
    font-weight: 100;
}

@font-face {
    // 这被解析为需要算术运算的普通表达式函数调用
    src: url($roboto-font-path + "/Roboto-Light.woff2") format("woff2");

    font-family: "Roboto";
    font-weight: 300;
}

@font-face {
    // 这被解析为内置的特殊函数
    src: url(#{$roboto-font-path}/Roboto-Regular.woff2) format("woff2");

    font-family: "Roboto";
    font-weight: 400;
}

/********************css output*********************/

@font-face {
  src: url("../fonts/roboto/Roboto-Thin.woff2") format("woff2");
  font-family: "Roboto";
  font-weight: 100;
}

@font-face {
  src: url("../fonts/roboto/Roboto-Light.woff2") format("woff2");
  font-family: "Roboto";
  font-weight: 300;
}

@font-face {
  src: url(../fonts/roboto/Roboto-Regular.woff2) format("woff2");
  font-family: "Roboto";
  font-weight: 400;
}
```
#### calc(),element(),progid:...(),and expression()
#### min() and max()
## Style Rules 样式规则

## At-Rules @规则
### @import
### @mixin and @include
### @function
### @extend
### @error
### @warn
### @debug
### @at-root
### Flow Control
#### @if and @else
#### @each
#### @for
#### while
### From CSS
#### @media
#### @supports
#### @keyframes

## Values 值
### Numbers 数值
### Strings 字符串
### Colors 颜色
### Lists 列表
### Maps 地图
### true and false 布尔值
### null 空
### Functions 函数

## Operators 运算符
### Equality 比较运算符
### Relational 关系运算符
### Numeric 数值运算符
### String 字符串运算符
### Boolean 布尔运算符

## Built-In Functions 内置函数
### Plain CSS 普通css函数
### Numbers 数字函数
#### abs($number)
```scss
@debug abs(10px); // 10px
@debug abs(-10px); // 10px
```
#### ceil($number)
```scss
@debug ceil(4); // 4
@debug ceil(4.2); // 5
@debug ceil(4.9); // 5
```
#### floor($number)
```scss
@debug floor(4); // 4
@debug floor(4.2); // 4
@debug floor(4.9); // 4
```
#### round($number)
```scss
@debug round(4); // 4
@debug round(4.2); // 4
@debug round(4.9); // 5
```
#### percentage($number)
```scss
@debug percentage(0.2); // 20%
@debug percentage(100px / 50px); // 200%
```
#### max($number...)
```scss
@debug max(1px, 4px); // 4px

$widths: 50px, 30px, 100px;
@debug max($widths...); // 100px
```
#### min($number...)
```scss
@debug min(1px, 4px); // 1px

$widths: 50px, 30px, 100px;
@debug min($widths...); // 30px
```
#### random($limit: null)
```scss
@debug random(); // 0.2821251858
@debug random(); // 0.6221325814

@debug random(10); // 4
@debug random(10000); // 5373
```
#### comparable($number1,$number2)
```scss
@debug comparable(2px, 1px); // true
@debug comparable(100px, 3em); // false
@debug comparable(10cm, 3mm); // true
```
#### unit($number)
```scss
@debug unit(100); // ""
@debug unit(100px); // "px"
@debug unit(5px * 10px); // "px*px"
@debug unit(5px / 1s); // "px/s"
```
#### unitless($number)
```scss
@debug unitless(100); // true
@debug unitless(100px); // false
```

### Strings 字符串函数
#### quote($string)
```scss
@debug quote(Helvetica); // "Helvetica"
@debug quote("Helvetica"); // "Helvetica"
```
#### unquote()
```scss
@debug unquote("Helvetica"); // Helvetica
@debug unquote(".widget:hover"); // .widget:hover
```
#### str-index($string, $substring)
```scss
@debug str-index("Helvetica Neue", "Helvetica"); // 1
@debug str-index("Helvetica Neue", "Neue"); // 11
```
#### str-insert($string, $insert, $index)
```scss
@debug str-insert("Roboto Bold", " Mono", 7); // "Roboto Mono Bold"
@debug str-insert("Roboto Bold", " Mono", -6); // "Roboto Mono Bold"
// 如果$ index的长度大于$ string的长度，则将$ insert添加到末尾。如果$ index小于字符串的负数长度，则将$ insert添加到开头。
@debug str-insert("Roboto", " Bold", 100); // "Roboto Bold"
@debug str-insert("Bold", "Roboto ", -100); // "Roboto Bold"
```
#### str-length($string)
```scss
@debug str-length("Helvetica Neue"); // 14
@debug str-length(bold); // 4
@debug str-index(""); // 0
```
#### str-slice($string, $start-at, $end-at: -1)
```scss
@debug str-slice("Helvetica Neue", 11); // "Neue"
@debug str-slice("Helvetica Neue", 1, 3); // "Hel"
@debug str-slice("Helvetica Neue", 1, -6); // "Helvetica"
```
#### to-upper-case($string)
```scss
@debug to-upper-case("Bold"); // "BOLD"
@debug to-upper-case(sans-serif); // SANS-SERIF
```
#### to-lower-case($string)
```scss
@debug to-lower-case("Bold"); // "bold"
@debug to-lower-case(SANS-SERIF); // sans-serif
```
#### unique-id()
```scss
@debug unique-id(); // uabtrnzug
@debug unique-id(); // u6w1b1def
```

### Colors 颜色值函数
### Lists 列表函数
### Maps 地图函数
### Selectors 选择函数
### Introspection 内置函数
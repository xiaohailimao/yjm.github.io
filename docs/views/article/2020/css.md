---
title: CSS
date: 2020-03-16
tags:
  - CSS
categories:
  - 文章
---
### 布局
#### 盒模型的宽度如何计算
- offsetWidth=（内容宽度+内边距+边框），无外边距
- box-sizing: border-box; width：100px，就包括padding+border+内容宽度，内容宽度会被缩小
#### margin纵向重叠的问题
- 相邻元素的margin-top和margin-bottom会发生重叠
- 空内容的`<p></p>` 也会重叠，会被忽略尺寸
#### margin负值的问题
- margin-top和margin-left负值，元素向上、向左移动
- margin-right负值，右侧元素向左移，自身不受影响
- margin-bottom负值，下方元素上移，自身不受影响
#### BFC的理解和应用
- Block format context，块级格式化上下文
- 一块独立的渲染区域，内部元素的渲染不会影响到边界以外的元素
- 形成BFC的常见条件
  - float不是none
  - position是absolute或者fixed
  - overflow不是visible
  - display是flex inline-block等
- BFC常见的应用
  - 清浮动
#### float布局问题，以及clearfix
- 如何实现圣杯布局和双飞翼布局
  - 三栏布局，中间一栏最先加载渲染（内容最重要）
  - 两侧内容固定，中间内容随着宽度自适应
  - 一般用于PC端
- 技术总结
  - 使用float布局
  - 两侧使用margin负值，以便和中间内容横向重叠
  - 防止中间内容被两侧覆盖，用padding或者margin实现
    
``` html
<!--圣杯布局-->
<style>
body,
html {
  height: 100%;
  margin: 0;
}

body {
  /* 防止中间内容被两侧覆盖 */
  padding: 0 100px;
}

aside {
  width: 100px;
  height: 100%;
  background: rgb(25, 201, 104);
}

main {
  width: 100%;
  height: 100%;
  background: #0989d4;
}
/* float布局 */
aside,main {
    float: left;
}

.left {
  /* 使用margin负值，和中间内容横向重叠 */
  margin-left: -100%; 
  position: relative;
  right: 100px;
}

.right {
  /* 使用margin负值，和中间内容横向重叠 */
  margin-right: -100px;
}

</style>


<body>
  <!-- 主要内容最先渲染 -->
  <main></main>
  <!-- 侧边栏两边浮动 -->
  <aside class="left"></aside>
  <aside class="right"></aside>
</body>

</html>
```
```html
<!-- 双飞翼布局 -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    html,
    body {
      height: 100%;
      margin: 0;
    }

    aside,
    main {
      float: left;
      height: 100%;
    }

    main {
      width: 100%;
      background: #f5f5f5;
    }

    .wrapper {
      /* 防止中间内容被两侧覆盖 */
      margin: 0 100px;
    }

    .left {
      width: 100px;
      background: #ccc;
      /* 使用margin负值，和中间内容横向重叠 */
      margin-left: -100%;
    }

    .right {
      width: 100px;
      background: #eee;
      /* 使用margin负值，和中间内容横向重叠 */
      margin-left: -100px;
    }
  </style>
</head>

<body>
  <main>
    <div class="wrapper"></div>
  </main>
  <aside class="left"></aside>
  <aside class="right"></aside>
</body>

</html>
```
#### 手写clearfix
```css
.clearfix:after {
    content: '';
    display: table;
    clear: both;
}
.clearfix {
    *zoom: 1; /* 兼容IE低版本 */
}
```

#### flex画色子
- flex-direction
- justify-content
- align-items
- flex-wrap
- align-self

```css
.box {
    display: flex;
    justify-content: space-between; /* 两端对齐 */
}
.item {
    /* 背景色，大小，边框等 */ 
}
.item:nth-child(2) {
    align-self: center;/* 第二项居中对齐 */
}
.item:nth-child(3) {
    align-self: flex-end;/* 第三项尾部对齐 */
}
```
### 定位
- absolute和relative分别依据什么定位
  - relative依据自身定位、absolute依据最近一层的**定位元素**定位
  - 定位元素：relative、absolute、fixed、body
- 居中对齐有哪些实现方式
  - 水平居中
    - inline元素：text-align：center
    - block元素：margin：auto
    - absolute元素：left：50%，margin-left：负值，必须知道子元素宽度
  - 垂直居中
    - inline元素：line-height=height
    - absolute元素：top：50%，margin-top：负值，必须知道子元素高度
    - absolute元素：transform：translate(-50%,-50%)
    - absolute元素：top，left，right，bottom都为0，margin：auto
### 图文样式
- line-height的继承问题
  - 写具体值 line-height:30px，那继承的就是这个30px
  - 写倍数line-height：1，那么继承的就是1，
  - **写百分比line-height：100%，那么继承的是计算后的值，例如font-size：16px，计算后line-height:16px，继承的时候就是具体的16px值（考点）**
### 响应式
- rem是什么：相对单位长度，相对于根元素
- 如何实现响应式
  - media query，根据不同屏幕宽度配置根元素的font-size
  - rem基于根元素的font-size计算长度单位
### css3
- 关于css3动画
  



## input 输入光标

```css
input {
  caret-color: #65a6ff;
}
.search-input::-webkit-input-placeholder {
  color: #fff !important;
}
```

---

## 去除 img 自带垂直间隙

```css
img {
  vertical-align: top;
}
```

---

## 滚动监听

滚动监听，需要取得 window 对象的，不能是 document，否则 IE8 识别不了

```javascript
 $(window).scroll(function () {
        var scroll = 400;
        if ($(document).scrollTop() > scroll) {
          $('.nav').addClass('toFixed')
        } else {
          $('.nav').removeClass('toFixed')
        }
      })
    })
```

---

## 文本字数限制超显示省略号

多行

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 7;
overflow: hidden;
```

单行

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

---

## 垂直居中

```css
display: inline-block;
vertical-align: middle;
```

---

## 布局

- 水平排列:
- float+width%
- 固定元素在相对位置:
- float+margin

---

## web 和 app 适配

- web：max-width:1000px(ipad pro 1024px)
- app: @media(min-width:320) and (max-width:1000px)

---

## 渐变

[开发文档](http://www.runoob.com/css3/css3-gradients.html)

```css
background: linear-gradient(to right, #6083c3, #6a99e7);
```

---

## 文本样式

- 文本缩进：text-indent
- 文本对齐：direction：rtl/ltr
- pre 标签：pre 元素可定义预格式化的文本。被包围在 pre 元素中的文本通常会保留空格和换行符。而文本也会呈现为等宽字体。

```css
.layout-text {
  white-space: normal;
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
```

```html
<div class="layout-text">
  <pre>
    ************   ****
    ******
    ************
    ***
   </pre
  >
</div>
```

## input IE 下样式差异

- 设置固定高度 height: 30px;
- 设置行高 line-height: 30px;
- IE 下 input 宽度会更宽些（多了删除按钮）

## 水平居中

```html
<div style="text-align:center">
  <div style="display:inline-block">居中的内容块</div>
</div>
```

## rem 移动端适配

_*rem：font size of the root element*_

### rem 数值计算

- 使用 sass

```scss
@function px2rem($px) {
  $rem: 37.5px;
  @return ($px/$rem) + rem;
}

height: px2rem(100px);
width: px2rem(100px);
```

- rem 基准值计算

选择确定的屏幕来作为参考，这里为什么要除以 10 呢，其实这个值是随便定义的,因为不想让 html 的 font-size 太大，当然也可以选择不除，只要在后面动态 js 计算时保证一样的值就可以

- iphone3gs: 320px / 10 = 32px

- iphone4/5: 320px / 10 = 32px

- iphone6: 375px / 10 =37.5px

- 动态设置 HTML 的 font-size

方法一：css

```css
@media (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
  html {
    font-size: 37.5px;
  }
}
```

方法二：js

```javascript
document.getElementsByTagName("html")[0].style.fontSize =
  window.innerWidth / 10 + "px";
```

### rem 适配进阶

1. 可以完全按照视觉稿上的尺寸，不用除 2
2. 解决了图片高清问题
3. 解决了 border 1px 问题（我们设置的 1px，在 iphone 上，由于 viewport 的 scale 是 0.5，所以就自然缩放成 0.5px）
4. 我们使用动态设置 viewport，在 iphone6 下，scale 会被设置成 1/2 即 0.5，其他手机是 1/1 即 1

```scss
/* sass */
html {
  font-size: 37.5px;
}

@function rem($px) {
  $rem: 75;
  @return ($px/$rem) + rem;
}

width: rem(100);
```

```html
<head>
  <meta charset="UTF-8" />
  <!-- 编码设置 -->
  <meta charset="UTF-8" />
  <!-- 渲染核心选择 -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <!-- 缩放控制 -->
  <meta
    name="viewport"
    content="initial-scale=1,maximum-scale=1,user-scalable=no"
  />
  <script>
    document.getElementsByTagName("html")[0].style.fontSize =
      window.innerWidth / 10 + "px"; //设置html字号
  </script>
</head>
```

```javascript
/* window.onload = function () {
    function autoMeta() {
       var dpr = window.devicePixelRatio;//dpr

        document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';//设置html字号

        var meta = document.getElementsByTagName('meta')['viewport'];

        meta.setAttribute('content',"initial-scale=" + 1 / dpr + ", maximum-scale=" + 1 / dpr + ", minimum-scale=" + 1 /dpr + ", user-scalable=no")//缩放控制
    }
    autoMeta()// 自动计算缩放和html字号
} */
```

## 解决滚动条使页面跳动的问题

```css
/*******************解决滚动条使页面跳动的问题*********************/
html {
  overflow-y: scroll; /*这一行代码会被 代码1 覆盖，我觉得是可以删除的，可能作者考虑到有可能下面的失效，那么不管有没有滚动条，在右边都会有一个灰色的区域，这也是一种解决方案，就是不管有没有滚动条，都预留位置，但是很难看啊*/
}

:root {
  overflow-y: auto; /*代码1*/
  overflow-x: hidden; /*横向就不使用滚动条*/
}

:root body {
  position: absolute;
}

body {
  width: 100vw;
  /*overflow: hidden;*/ /*超出100vw的内容都隐藏，实际我们设计的页面都不会超过100vw，而且一般会边距，所以一般滚动条的出现不会遮盖到内容*/
}
/*********************************************/

/* 最简单的 */
html {
  overflow-y: scroll;
}
```

## button 默认样式清除

```css
button {
  outline: none;
  padding: 0;
  margin: 0;
  border: 1px solid transparent;
}
```

## 100%高度设置

```css
html,
body {
  height: 100%;
}
/* -最小高度100%屏幕高度 */
.wrapper {
  min-height: 100%;
}
```

## ie8 背景图片不显示问题

```scss
/*正确的*/
background: url("url") no-repeat;
/*错误的*/
background: url("url") no-repeat;

/* 差别在no-repeat前的空格，需要加上空格 */
```

## 移动端内容超出问题

```css
body {
  overflow: hidden;
}
```

## 去除 IEinput 和 textarea 自带的清除按钮和密码查看按钮

```css
::-ms-clear,
::-ms-reveal {
  display: none;
}
```

## input placeholder 垂直对齐错位

input 不要设置 line-height 或者设置为 1px

## will-change

增强页面渲染性能
[文章链接](https://www.zhangxinxu.com/wordpress/2015/11/css3-will-change-improve-paint/)

```css
/* 关键字值 */
will-change: auto;
will-change: scroll-position;
will-change: contents;
will-change: transform; /* <custom-ident>示例 */
will-change: opacity; /* <custom-ident>示例 */
will-change: left, top; /* 两个<animateable-feature>示例 */

/* 全局值 */
will-change: inherit;
will-change: initial;
will-change: unset;
```

```css
/*css demo*/
.will-change-parent:hover .will-change {
  will-change: transform;
}
.will-change {
  transition: transform 0.3s;
}
.will-change:hover {
  transform: scale(1.5);
}
```

```js
dom.onmousedown = function() {
  target.style.willChange = "transform";
};
dom.onclick = function() {
  // target动画哔哩哔哩...
};
target.onanimationend = function() {
  // 动画结束回调，移除will-change
  this.style.willChange = "auto";
};
```

```css
.blur {
  -webkit-filter: blur(4px);
  filter: blur(4px);
}

.brightness {
  -webkit-filter: brightness(0.3);
  filter: brightness(0.3);
}

.contrast {
  -webkit-filter: contrast(180%);
  filter: contrast(180%);
}

.grayscale {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.huerotate {
  -webkit-filter: hue-rotate(180deg);
  filter: hue-rotate(180deg);
}

.invert {
  -webkit-filter: invert(100%);
  filter: invert(100%);
}

.opacity {
  -webkit-filter: opacity(50%);
  filter: opacity(50%);
}

.saturate {
  -webkit-filter: saturate(7);
  filter: saturate(7);
}

.sepia {
  -webkit-filter: sepia(100%);
  filter: sepia(100%);
}

.shadow {
  -webkit-filter: drop-shadow(8px 8px 10px green);
  filter: drop-shadow(8px 8px 10px green);
}
```

## vw+rem

- 给根元素的字体大小设置随着视窗变化而变化 vw 单位，这样就可以实现动态改变其大小
- 其他元素的文本大小号、布局高、宽、间距、留白都使用 rem 单位
- 限制根元素字体大小的最大最小值，配合 body 加上最大宽度和最小宽度，实现布局宽度的最大最小限制

```scss
// rem 单位换算： 定为75px只是方便运算，750px-75px、640px-60px、1080px-108px
// iPhone6 尺寸的根元素大小基准值
$vw_fontsize: 75;

@function rem($px) {
  @return ($px/$vw_fontsize) * 1rem;
}

// 设计图宽度值
$vw_design: 750;

html {
  // 根元素大小使用vw单位
  font-size: ($vw_fontsize / ($vw_design/2)) * 100vw;

  // 通过media 查询限制根元素最大最小值
  @media screen and (max-width: 320px) {
    font-size: 64px;
  }

  @media screen and (min-width: 540px) {
    font-size: 108px;
  }
}

// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小
body {
  max-width: 540px;
  min-width: 320px;
}
```

## 1px 问题

- 1 物理像素线（普通屏 1px，高清屏 0.5px）采用 transform 属性的 scale 实现

```scss
.mod_grid {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    pointer-events: none;
    background-color: #fafafa;
    height: 1px;
    left: 0;
    right: 0;
    top: 0;
    @media only screen and (-webkit-min-device-pixel-ratio: 2) {
      -webkit-transform: scaleY(0.5);
      -webkit-transform-origin: 50% 0%;
    }
  }
}
```

## 图片保持比例

- 应用 padding-top 实现

```scss
.mod_banner {
  position: relative;
  // 使用padding-top 实现宽高比为 100:750 的图片区域
  padding-top: percentage(100/750);
  height: 0;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
    position: absolute;
    left: 0;
    top: 0;
  }
}
```

## Flexbox and Internet Explorer 11 显示问题

使用`flex-grow:1`而不是`flex:1`原因 IE10 和 IE11 默认值`flexARE 0 0 auto`和没有`0 1 auto`

## 页面最小全屏高度

```css
min-height: 100%;
box-sizing: border-box; /* 页面加padding值后当内容不足100%时不会导致页面滑动 */
```

## zoom 与 scale 对比

兼容：

- zoom 仅 Firefox 不支持
- scale 从 IE9+到其他现代浏览器都支持

zoom

- 百分比值：zoom:50%，表示缩小到原来的一半。
- 数值：zoom:0.5，表示缩小到原来的一半。
- normal 关键字：zoom:normal 等同于 zoom:1

scale

- scale 并不支持百分比值和 normal 关键字，只能是数值。而且，还能是负数，没错，负数。而 zoom 不能是负值！

差异

- zoom 的缩放是相对于左上角的；而 scale 默认是居中缩放
- zoom 的缩放改变了元素占据的空间大小；而 scale 的缩放占据的原始尺寸不变，页面布局不会发生变化
- 控制缩放的值不一样。zoom 更全面，但是不能是负数，只能等比例控制；而 scale 虽然只能是数值，但是能负数，可以只控制 1 个维度

zoom 适合移动端静态页面的缩放，scale 适合动画

## 毛玻璃效果

```css
/* 毛玻璃效果 */
.frosted-glass {
  background-color: #fff;
}

@supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
  .frosted-glass {
    background: hsla(0, 0%, 100%, 0.75);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
  }
}
```

## 基于 vertical-align 属性的水平垂直居中弹框

(1) 节省了很多无谓的定位的 JavaScript 代码，也不需要浏览器 resize 事件之类的处理，当弹框内容动态变化的时候，也无须重新定位。  
(2) 性能更改、渲染速度更快，毕竟浏览器内置 CSS 的即时渲染显然比 JavaScript 的处理要更好。  
(3) 可以非常灵活控制垂直居中的比例，比方说设置:

```css
.container:after {
  height: 90%;
}
```

则弹框不是垂直居中对齐，而是近似上下 2:3 这种感觉的对齐，反而会让人有视觉上居中的 感觉。
(4) 容器设置 overflow:auto 可以实现弹框高度超过一屏时依然能看见屏幕外的内容， 传统实现方法则比较尴尬。

```html
<div class="container">
  <div class="dialog">
    <div class="center">
      弹框站位内容
    </div>
  </div>
</div>
```

```css
.container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center; /* 水平居中对齐 */
  /*  
        1.x中心点位置在container的上边缘
        2.高度为100%宽度为0的伪元素和x中心点对齐
        3.css默认左上方排列对齐，x中心和伪元素一起下移半个容器高度，此时x中心点在容器的垂直中心线上
        4.这里借助伪元素创建了一个和外部容器一样高的宽度为 0 的 inline- block 元素。有种“幽灵空白节点”的感觉
    */
  font-size: 0;
  white-space: nowrap;
  overflow: auto;
}
.container::after {
  content: "";
  display: inline-block;
  height: 90%;
  vertical-align: middle; /* 垂直居中对齐 */
}
.dialog {
  display: inline-block;
  vertical-align: middle; /* 垂直居中对齐 */
  text-align: left;
  font-size: 14px;
  white-space: normal;
  background: #fff;
  border-radius: 6px;
}
.center {
  height: 100px;
  width: 200px;
  padding: 10px;
}
```
<vertical-align />
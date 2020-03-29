---
title: CSS
date: 2020-03-16
tags:
 - CSS
categories:
 -  文章
---

## input输入光标
```css
input{
 
  caret-color: #65a6ff;
}
.search-input::-webkit-input-placeholder { 
    color:    #fff !important;
}
```
---
## 去除img自带垂直间隙
```css
img{
    vertical-align: top;
}
```
---
## 滚动监听
滚动监听，需要取得window对象的，不能是document，否则IE8识别不了


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
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
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

## web和app适配

- web：max-width:1000px(ipad pro 1024px)
- app: @media(min-width:320) and (max-width:1000px)
---

## 渐变
[开发文档](http://www.runoob.com/css3/css3-gradients.html)
```css
  background: linear-gradient(to right,#6083C3, #6A99E7);
```
---
## 文本样式


- 文本缩进：text-indent
- 文本对齐：direction：rtl/ltr
- pre标签：pre 元素可定义预格式化的文本。被包围在 pre 元素中的文本通常会保留空格和换行符。而文本也会呈现为等宽字体。

```css
.layout-text{
    white-space: normal;
    pre{
        white-space: pre-wrap;
        word-wrap: break-word;
    }
}
```
```html
<div class="layout-text">

  <pre >
    ************   ****
    ******
    ************
    ***   
   </pre>
</div>

```  
## input IE下样式差异
- 设置固定高度 height: 30px;
- 设置行高 line-height: 30px;
- IE下input宽度会更宽些（多了删除按钮）

## 水平居中
```html
    <div style="text-align:center">
        <div style="display:inline-block">居中的内容块</div>
    </div>
```

## rem 移动端适配
*rem：font size of the root element*
### rem 数值计算
- 使用sass
```scss
    @function px2rem($px){
        $rem:37.5px;
        @return ($px/$rem) + rem;
    }
    
    height: px2rem(100px);
    width:px2rem(100px);
```
- rem基准值计算

选择确定的屏幕来作为参考，这里为什么要除以10呢，其实这个值是随便定义的,因为不想让html的font-size太大，当然也可以选择不除，只要在后面动态js计算时保证一样的值就可以

- iphone3gs: 320px / 10 = 32px

- iphone4/5: 320px  / 10 = 32px

- iphone6: 375px  / 10 =37.5px

- 动态设置HTML的font-size

方法一：css
```css
@media (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2){
      html{font-size: 37.5px;}
}
```
方法二：js
```javascript
document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
```
### rem适配进阶
1. 可以完全按照视觉稿上的尺寸，不用除2
2. 解决了图片高清问题
3. 解决了border 1px 问题（我们设置的1px，在iphone上，由于viewport的scale是0.5，所以就自然缩放成0.5px）
4. 我们使用动态设置viewport，在iphone6下，scale会被设置成1/2即0.5，其他手机是1/1即1


```scss
/* sass */
html {
    font-size: 37.5px;
}

@function rem($px) {
    $rem: 75;
    @return ($px/$rem)+rem;
}

width:rem(100);
```

```html
<head>
    <meta charset="UTF-8">
     <!-- 编码设置 -->
    <meta charset="UTF-8">
    <!-- 渲染核心选择 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!-- 缩放控制 -->
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
    <script>document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';//设置html字号</script>
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
	overflow-y: scroll;/*这一行代码会被 代码1 覆盖，我觉得是可以删除的，可能作者考虑到有可能下面的失效，那么不管有没有滚动条，在右边都会有一个灰色的区域，这也是一种解决方案，就是不管有没有滚动条，都预留位置，但是很难看啊*/
  }
  
  :root {
	overflow-y: auto;/*代码1*/
	overflow-x: hidden;/*横向就不使用滚动条*/
  }
  
  :root body {
	position: absolute;
  }
  
  body {
	width: 100vw;
    /*overflow: hidden;*//*超出100vw的内容都隐藏，实际我们设计的页面都不会超过100vw，而且一般会边距，所以一般滚动条的出现不会遮盖到内容*/
  }
  /*********************************************/
  
  /* 最简单的 */
  html{overflow-y: scroll;}
```
## button默认样式清除
```css
button{
    outline:none;
    padding:0;
    margin:0;
    border:1px solid transparent;
}
```
## 100%高度设置
```css
html,body{
    height:100%
}
/* -最小高度100%屏幕高度 */
.wrapper{
    min-height:100%;
}
```
## ie8 背景图片不显示问题
```scss
    /*正确的*/
    background: url("url") no-repeat;
    /*错误的*/
    background: url("url")no-repeat;
    
    /* 差别在no-repeat前的空格，需要加上空格 */
```
## 移动端内容超出问题
```css
body{
    overflow:hidden;
}
```
## 去除IEinput和textarea自带的清除按钮和密码查看按钮
```css
::-ms-clear,::-ms-reveal{display:none;}
```
## input placeholder垂直对齐错位

input 不要设置line-height或者设置为1px


## will-change
增强页面渲染性能
[文章链接](https://www.zhangxinxu.com/wordpress/2015/11/css3-will-change-improve-paint/)
```css
/* 关键字值 */
will-change: auto;
will-change: scroll-position;
will-change: contents;
will-change: transform;        /* <custom-ident>示例 */
will-change: opacity;          /* <custom-ident>示例 */
will-change: left, top;        /* 两个<animateable-feature>示例 */

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
    target.style.willChange = 'transform';
};
dom.onclick = function() {
    // target动画哔哩哔哩...
};
target.onanimationend = function() {
    // 动画结束回调，移除will-change
    this.style.willChange = 'auto';
};
```



```css
.blur {
    -webkit-filter: blur(4px);
    filter: blur(4px);
}

.brightness {
    -webkit-filter: brightness(0.30);
    filter: brightness(0.30);
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
- 给根元素的字体大小设置随着视窗变化而变化vw单位，这样就可以实现动态改变其大小
- 其他元素的文本大小号、布局高、宽、间距、留白都使用rem单位
- 限制根元素字体大小的最大最小值，配合body加上最大宽度和最小宽度，实现布局宽度的最大最小限制

```scss
// rem 单位换算： 定为75px只是方便运算，750px-75px、640px-60px、1080px-108px
// iPhone6 尺寸的根元素大小基准值
$vw_fontsize:75;

@function rem($px){
    @return ($px/$vw_fontsize) * 1rem;
}

// 设计图宽度值
$vw_design:750;

html{

    // 根元素大小使用vw单位
    font-size:($vw_fontsize / ($vw_design/2)) *100vw;

    // 通过media 查询限制根元素最大最小值
    @media screen and (max-width: 320px){
        font-size:64px;
    }

    @media screen and (min-width:540px){
        font-size:108px;
    }

}

// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小
body{
    max-width:540px;
    min-width:320px;
}

```

## 1px问题
- 1物理像素线（普通屏1px，高清屏0.5px）采用transform属性的scale实现

```scss
.mod_grid{
    position: relative;
    &::after{
        content:"";
        position:absolute;
        z-index:1;
        pointer-events:none;
        background-color:#fafafa;
        height:1px;
        left:0;
        right:0;
        top:0;
        @media only screen and (-webkit-min-device-pixel-ratio:2){
            -webkit-transform:scaleY(0.5);
            -webkit-transform-origin:50% 0%;
        }
    }
}
```

## 图片保持比例
- 应用padding-top实现

```scss

.mod_banner {
    position: relative;
    // 使用padding-top 实现宽高比为 100:750 的图片区域
    padding-top:percentage(100/750);
    height:0;
    overflow:hidden;
    img{
        width:100%;
        height:auto;
        position:absolute;
        left:0;
        top:0;
    }
}

```

## Flexbox and Internet Explorer 11 显示问题
使用`flex-grow:1`而不是`flex:1`原因IE10和IE11默认值`flexARE 0 0 auto`和没有`0 1 auto`

## 页面最小全屏高度

```css
min-height:100%;
box-sizing:border-box;/* 页面加padding值后当内容不足100%时不会导致页面滑动 */
```
## zoom 与 scale 对比
兼容：
- zoom仅Firefox不支持     
- scale从IE9+到其他现代浏览器都支持

zoom
- 百分比值：zoom:50%，表示缩小到原来的一半。
- 数值：zoom:0.5，表示缩小到原来的一半。
- normal关键字：zoom:normal等同于zoom:1

scale
- scale并不支持百分比值和normal关键字，只能是数值。而且，还能是负数，没错，负数。而zoom不能是负值！

差异
- zoom的缩放是相对于左上角的；而scale默认是居中缩放
- zoom的缩放改变了元素占据的空间大小；而scale的缩放占据的原始尺寸不变，页面布局不会发生变化
- 控制缩放的值不一样。zoom更全面，但是不能是负数，只能等比例控制；而scale虽然只能是数值，但是能负数，可以只控制1个维度

zoom适合移动端静态页面的缩放，scale适合动画

## 毛玻璃效果
```css
/* 毛玻璃效果 */
.frosted-glass {
  background-color: #fff;
}

@supports (-webkit-backdrop-filter:none) or (backdrop-filter:none) {
  .frosted-glass {
    background: hsla(0, 0%, 100%, .75);
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
.container{
    position: fixed;
    top: 0;bottom: 0;left: 0;right: 0;
    background-color: rgba(0,0,0,.5);
    text-align: center;/* 水平居中对齐 */
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
.container::after{
    content: "";
    display: inline-block;
    height: 90%;
    vertical-align: middle;/* 垂直居中对齐 */
}
.dialog{
    display: inline-block;
    vertical-align: middle;/* 垂直居中对齐 */
    text-align: left;
    font-size: 14px;
    white-space: normal;
    background: #fff;
    border-radius: 6px;
}
.center{
    height: 100px;
    width: 200px;
    padding: 10px;
}
```
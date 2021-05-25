---
title: css知识点
date: 2021-01-21
tags: 
- 理论
categories: 
- 文章
---

## 盒子模型

- 盒模型组成：content、boder、padding、margin
- 标准盒模型：width 和 height 只包含 content
- IE盒模型：width 和 height 包含 content、padding、border的内容
- 可以通过border-box切换盒模型
  - border-box：content-box 标准盒模型
  - border-box：border-box IE盒模型
- offsetWidth=（内容宽度+内边距+边框），无外边距
- box-sizing: border-box; width：100px，就包括`padding+border+内容宽度`，内容宽度会被缩小
## CSS 选择符有哪些？

- id选择器（`#id`）
- class选择器（`.className`）
- tag选择（`div，p`）
- 后代选择器（`div p`）
- 子选择器（`div>a`）
- 兄弟选择器（`li~a`）
- 相邻兄弟选择器（`li+a`）
- 属性选择器（`a[rel='external']`）
- 伪类选择器（`a:hover,li:nth-child`）
- 伪元素选择器（`::before, ::after`）
- 通配符选择器（`*`）


## margin纵向重叠的问题
- 相邻元素的margin-top和margin-bottom会发生重叠
- 空内容的`<p></p>` 也会重叠，会被忽略尺寸
## margin负值的问题
- margin-top和margin-left负值，元素向上、向左移动
- margin-right负值，右侧元素向左移，自身不受影响
- margin-bottom负值，下方元素上移，自身不受影响
## BFC的理解和应用
- Block format context，块级格式化上下文
- 一块独立的渲染区域，内部元素的渲染不会影响到边界以外的元素
- 形成BFC的常见条件
  - float不是none
  - position是absolute或者fixed
  - overflow不是visible
  - display是flex inline-block等
- BFC常见的应用
  - 清浮动
## float布局问题，以及clearfix
- 如何实现圣杯布局和双飞翼布局
  - 三栏布局，中间一栏最先加载渲染（内容最重要）
  - 两侧内容固定，中间内容随着宽度自适应
  - 一般用于PC端
- 技术总结
  - 使用float布局
  - 两侧使用margin负值，以便和中间内容横向重叠
  - 防止中间内容被两侧覆盖，用padding或者margin实现

### 圣杯布局

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
### 双飞翼布局

```html
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

### 手写clearfix
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

## flex画色子
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
## 定位
### absolute和relative分别依据什么定位
- relative依据自身定位、absolute依据最近一层的**定位元素**定位
- 定位元素：relative、absolute、fixed、body
### 居中对齐有哪些实现方式
- 水平居中
  - inline元素：text-align：center
  - block元素：margin：auto
  - absolute元素：left：50%，margin-left：负值，必须知道子元素宽度
- 垂直居中
  - inline元素：line-height=height
  - absolute元素：top：50%，margin-top：负值，必须知道子元素高度
  - absolute元素：top：50% transform：translateY(-50%)
  - absolute元素：top，left，right，bottom都为0，margin：auto
## 图文样式
- line-height的继承问题
  - 写具体值 line-height:30px，那继承的就是这个30px
  - 写倍数line-height：1，那么继承的就是1，
  - **写百分比line-height：100%，那么继承的是计算后的值**，例如font-size：16px，计算后line-height:16px，继承的时候就是具体的16px值（考点）
## 响应式
- rem是什么：相对单位长度，相对于根元素
- 如何实现响应式
  - `media query`，根据不同屏幕宽度配置`根元素的font-size`
  - `rem` 基于`根元素的font-size`计算长度单位

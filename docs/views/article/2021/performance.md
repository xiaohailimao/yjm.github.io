---
title: 性能优化
date: 2021-01-11
tags: 
- 性能优化
categories: 
- 文章
---

## 网络

## webpack

可用于生产环境的
- IgnorePlugin 忽略编译
- 优化babel-loader，配置缓存和限定编译范围 include exclude
- happyPack 开启多线程编译，推荐使用 thread-loader 代替
- noParse 不解析
- parallelUglifyPlugin 启用多进程压缩代码，开多进程也需要消耗性能，所以按需使用，推荐使用 terser-webpack-plugin 配置 parallel=true 开启多进程

不可用于生产环境的
- 自动刷新
- 热更新
- DllPlugin

优化产出代码
- 小图片base64编码
- bundle加hash
- 懒加载
- 提取公共代码
- 使用cdn加速
- IgnorePlugin
- 使用mode模式配置成production
- scope hosting

## 图片优化

1. jpg/jpeg：有损压缩、体积小、不支持透明背景、适合banner图
2. png：无损压缩、体积大、支持透明背景、适用logo图
3. svg：文本文件、矢量图、体积小、不失真、兼容好、渲染成本比较高
4. base64：文本文件、依赖编码、小图标解决方案、补充雪碧图存在、适用小图标
5. webp：全能、兼容不好

## 储存

- sessionStorage/localStorage
- http cache
  - 强制缓存
  - 协商缓存

## 渲染

- 服务端渲染
- 

## 应用

## 性能监控

## 总结

### 原则（空间换时间）

- 多使用内存、缓存或其他方法
- 减少CPU计算量、减少网络加载耗时
### 加载更快

- 减少资源体积：压缩代码
- 减少访问次数：合并代码，SSR服务器端渲染，缓存
- 使用更快的网络: CDN
### 渲染更快

- css 放在head里面，js放在body最后面
- 尽早开始执行js，用**DOMContentLoaded**触发
- 懒加载（图片懒加载，上滑加载更多）
- 对DOM查询进行缓存
- 频繁DOM操作，合并到一起插入DOM结构，（document.createDocumentFragment）
- 节流throttle防抖debounce（体验上的优化）
### 缓存

- 静态资源加hash后缀，根据文件内容计算hash
- 文件内容不变，则hash不变，则url不变
- url和文件不变，则会自动触发http缓存机制，返回304
### SSR

- 服务端渲染：将网页和数据一起加载，一起渲染（快，首屏渲染）
- 非SSR（前后分离项目）：先加载网页，在加载数据，在渲染数据
- 早先的 jsp、asp、php 都是SSR，现在的vue react SSR
### 图片懒加载

```html
<img id="img1" src="default.png" data-src="http://xxx.com/img.png"/>
<script>
  var img1 = document.getElementById("img1")
  img1.src = img1.getAttribute("data-src")
</script>
```
### 对DOM查询做缓存

```js
 // 不缓存DOM查询结果
 for(let i = 0; document.getElementsByTagName('p').length; i++){
    // 每次循环，都会计算length，频繁操作DOM查询 
 }
 
 // 缓存DOM查询结果
 const pList =  document.getElementsByTagName('p')
 const length = pList.length
 for(let i = 0;i<length; i++){
     // 缓存length，只查询一次DON
 }
 ```
### 将频繁操作改为一次性操作

 ```js
const app = document.getElementById('app')
const frag = document.createDocumentFragment() // 创建文档片段，储存未渲染节点，此时还没插入DOM中

for (let i = 0; i < 10; i++) {
  const div = document.createElement('div')
  div.innerHTML = `list item ${i}`
  frag.appendChild(div) // 储存节点
}

app.appendChild(frag) // 一次性添加到app节点中
```
### 尽早开始执行js

```js
window.addEventListener('load',function(){
    // 资源都加载完成触发，图片、视频都要加载完成
})

window.addEventListener('DOMContentLoaded',function(){
    // DOM渲染完成触发，图片、视频不需要加载完成
})
```
### 防抖debounce

- 监听input输入框，文字变化触发change事件
- 直接用keyup事件，则会频繁触发change事件
- 防抖：用户输入结束或者暂停，才会触发change事件
- 多次触发会更新定时任务，重新计时，只执行最后一次定时任务

```html
<body>
  <input type="text" id="input1">
  <script>
    const input1 = document.getElementById('input1')
    input1.addEventListener('keyup', debounce(function (){
      console.log(input1.value);
    }))

    function debounce(fn, delay = 500) {
      let timer = null // 闭包中私有数据，延长变量生命周期
      // 返回函数产生闭包
      return function () {
        if (timer) {
          clearTimeout(timer)
        }
        // 多次触发会更新定时任务，重新计时，只执行最后一次定时任务
        timer = setTimeout(() => {
          fn.apply(this, arguments)
          timer = null
        }, delay)
      }
    }
  </script>
</body>
```
### 节流throttle

- 保持一个频率触发
- 拖拽一个元素时，要随时拿到该元素被拖拽的位置
- 直接用drag事件，则会频繁触发，很容易导致卡顿
- 节流：无论拖拽速度多快，都会每隔100ms触发一次
- 计时时间内多次触发不处理直接返回

```html
<body>
  <div style="width: 100px;height: 100px;border: solid 1px;" draggable="true" id="div1"></div>
  <script>
    const div1 = document.getElementById('div1')
    div1.addEventListener('drag', throttle(function (e) {
      console.log(e.offsetX, e.offsetY);
    }, 200))
    function throttle(fn, delay = 100) {
      let timer = null // 闭包中私有数据，延长变量生命周期
      return function () {
        // 计时时间内多次触发不处理直接返回
        if (timer) {
          return
        }
        timer = setTimeout(() => {
          fn.apply(this, arguments)
          timer = null
        }, delay)
      }
    }
  </script>
</body>
```
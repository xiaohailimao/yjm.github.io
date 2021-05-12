---
title: 性能优化
date: 2021-03-11
tags: 
- 性能优化
categories: 
- 文章
---
## 性能优化原则（空间换时间）

- 多使用内存、缓存或其他方法
- 减少CPU计算量、减少网络加载耗时
- 优化方向
  - 缓存资源减少网络请求次数，压缩代码删除无用代码减小资源体积，CDN加快资源请求速度
  - 优化DOM操作，加快页面显示，减少不必要的渲染计算
  - webpack层面的优化，减少不比要的CPU计算，提高CPU利用率，提高代码打包质量
## 网络

- 减少资源体积：压缩代码
- 减少访问次数：合并代码，SSR服务器端渲染，缓存
- 使用更快的网络: CDN
- HTTP2
- 资源预加载
- 异步无阻塞加载JS

### webpack优化产出代码

- 小图片base64编码
- bundle加hash
- 懒加载
- 提取公共代码
- 使用cdn加速
- IgnorePlugin
- production 该模式会自动压缩代码和删除无用代码
- scope hosting
- 图片压缩

### 图片质量与性能的博弈

1. jpg/jpeg：有损压缩、体积小、不支持透明背景、**适合banner图**
2. png：无损压缩、体积大、支持透明背景、**适用logo图**
3. svg：文本文件、矢量图、体积小、不失真、兼容好、**渲染成本比较高**
4. base64：文本文件、依赖编码、**小图标解决方案**、补充雪碧图存在、适用小图标
5. webp：全能、**兼容不好**
### HTTP2

四个特性
- 多路复用，无需多个TCP连接，因为其允许在单一的HTTP2连接上发起多重请求，因此可以不依赖建立多个TCP连接
- 二进制分帧，将所有传输的信息采用二进制编码，并且会将信息分割为更小的信息块
- 头部压缩，采用HPACK技术压缩头部，减小报文体积
- 服务端推送，服务端可以对客户端发的一个请求发送多个响应，并且资源可以正常缓存

``` BASH
server {
  listen 443 ssl http2
}
```
::: warning
使用 http2 的前提是必须是 https
:::

### 资源预加载

提前加载资源，当用户需要的时候可以直接从本地中渲染
#### preload

preload 页面加载过程中，在浏览器开始主体渲染之前加载
``` html
<link rel="preload" href="style.css" as="style">
<link rel="preload" href="index.js" as="script">
```

#### prefetch

prefetch 页面加载完成后，利用空闲时间提前加载
``` HTML
<link rel="prefetch" href="next.css">
<link rel="prefetch" href="next.js">
```
::: warning
注意：vue-cli 默认开启 prefetch ，可在 vue.config.js 中全局禁用 prefetch ，再针对指定模块开启。
``` JS
chainWebpack: config => {
  config.plugins.delete('prefetch')
}
```
:::

### 异步无阻塞加载JS
#### 普通的 script 标签解析过程

当页面渲染过程中遇到

``` HTML
<script src="main.js" ></script>
```
解析过程
- 停止document解析
- 加载main.js
- 执行main.js中的脚本
- 继续document解析

#### defer 的 script 标签解析过程
当页面渲染过程中遇到

``` HTML
<script src="main.js" defer></script>
<script src="common.js" defer></script>
```
解析过程
- 不阻止解析 document，并行下载main.js、common.js
- 即使下载完main.js、common.js仍继续解析 document
- 按照页面中出现的顺序，在其他同步脚步执行后，DOMContentLoaded 事件前，依次执行 main.js、common.js
#### async 的 script 标签解析过程
当页面渲染过程中遇到

``` HTML
<script src="main.js" async></script>
<script src="common.js" async></script>
```
解析过程
- 不阻止解析 document，并行下载main.js、common.js
- 当脚本下载完成后立即执行，两者执行顺序不确定，执行阶段不确定，可能在 DOMContentLoaded 事件前或者后

### CDN

- 就近访问CDN服务器，加快资源加载
- 核心特点：缓存、回溯
  - 缓存：我们把资源copy一份到CDN服务器上这个过程
  - 回溯：CDN发现没有这个资源（一般是过期了），向根服务器（或者上层服务器）去要这个资源的过程
- CDN缓存的是静态资源
- 应用
  - 把静态资源和主页面置于不同的域名下，可以完美地避免了不必要的 Cookie 的出现
## 缓存

- 本地缓存
- http 缓存
- 静态资源加hash后缀，根据文件内容计算hash，文件内容不变，则hash不变，则url不变，url和文件不变，则会自动触发http缓存机制，返回304
### 本地缓存

- sessionStorage 会话缓存，浏览器关闭就会清空 5M
- localStorage 本地永久缓存 5M
- indexeDB 运行在浏览器上的非关系型数据库 无限（一般来说不会小于 250M）
### HTTP 缓存策略（强制缓存+协商缓存）

- 强制缓存：`Cache-Control`，未过期前没走服务端
- 协商缓存（对比缓存），会走服务端
  - 服务器缓存策略。服务端判断是不是可以被缓存，不是缓存在服务器
  - 服务器判断客户端资源，是否和服务端资源一样
  - 一致返回 `304`，否则返回200和最新的资源
  - `Last-Modified` 资源的最后修改时间
  - `If-Modified-Since` request header 中带的最近的 `Last-Modified` 值
  - `Etag` 资源的唯一标识（一个字符串）
  - `If-None-Match` request header 中带的最近的 `Etag` 值
  - **`Last-Modified` 和 Etag 共存，优先使用 Etag**
  - `Last-Modified` 只能精确到秒级
  - 如果资源重复生成，而内容不变，则 `Etag` 更精准
![HTTP 缓存决策指南](https://user-gold-cdn.xitu.io/2018/9/20/165f701820fafcf8?imageView2/0/w/1280/h/960/ignore-error/1)


## 渲染

- css 放在head里面减少重复渲染，js放在body最后面防止js加载阻塞页面渲染
- 尽早开始执行js，用**DOMContentLoaded**触发
- 懒加载（图片懒加载，上滑加载更多）
- 对DOM查询进行缓存
- 频繁DOM操作，合并到一起插入DOM结构，（document.createDocumentFragment）
- 节流throttle防抖debounce（体验上的优化）

### 异步更新策略

当我们使用 Vue 或 React 提供的接口去更新数据时，这个更新并不会立即生效，而是会被推入到一个队列里。待到适当的时机，队列中的更新任务会被批量触发。这就是异步更新

异步更新可以合并修改一次渲染，提高渲染性能

#### vue状态更新手法：nextTick

Vue 每次想要更新一个状态的时候，会先把它这个更新操作给包装成一个异步操作派发出去。这件事情，在源码中是由一个叫做 nextTick 的函数来完成的：
```js
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  // 检查上一个异步任务队列（即名为callbacks的任务数组）是否派发和执行完毕了。pending此处相当于一个锁
  if (!pending) {
    // 若上一个异步任务队列已经执行完毕，则将pending设定为true（把锁锁上）
    pending = true
    // 是否要求一定要派发为macro任务
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      // 如果不说明一定要macro 你们就全都是micro
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
这里可以看到，Vue 的`异步任务默认情况下都是用 Promise 来包装的`，也就是是说它们都是 `micro-task`。

继续细化解析一下 `macroTimeFunc()` 和 `microTimeFunc()` 两个方法。

macroTimeFunc() 是这么实现的：
```js
// macro首选setImmediate 这个兼容性最差
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
    isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]'
  )) {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = flushCallbacks
    macroTimerFunc = () => {
      port.postMessage(1)
    }
} else {
  // 兼容性最好的派发方式是setTimeout
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```
microTimeFunc() 是这么实现的：
```js
// 简单粗暴 不是ios全都给我去Promise 如果不兼容promise 那么你只能将就一下变成macro了
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
} else {
  // 如果无法派发micro，就退而求其次派发为macro
  microTimerFunc = macroTimerFunc
}
```
注意，无论是派发 `macro` 任务还是派发 `micro` 任务，派发的任务对象都是一个叫做 `flushCallbacks` 的东西，这个东西做了什么呢？

flushCallbacks 源码如下：
```js
function flushCallbacks () {
  pending = false
  // callbacks在nextick中出现过 它是任务数组（队列）
  const copies = callbacks.slice(0)
  callbacks.length = 0
  // 将callbacks中的任务逐个取出执行
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```
### 图片懒加载

图片懒加载常用于**首屏优化**，图片资源往往比代码体积大很多，由于图片资源加载挤占了代码带宽会让页面渲染更慢，图片懒加载能够很好解决该问题

```html
<div>
    <img src="default.jpg" data-src="https://user-gold-cdn.xitu.io/2019/5/27/16af82bc7ddcdc22?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" alt="" width="100%" height="500px">
    <img src="default.jpg" data-src="https://cn.vuejs.org/images/lifecycle.png" alt="" width="100%" height="500px">
    <img src="default.jpg" data-src="https://vuex.vuejs.org/vuex.png" alt="" width="100%" height="500px">
  </div>
```

在懒加载的实现中，有两个关键的数值：一个是**当前可视区域的高度**，另一个是**元素距离可视区域顶部的高度**。

- 当前可视区域的高度
``` JS
const viewHeight = window.innerHeight || document.documentElement.clientHeight
```
- 元素距离可视区域顶部的高度: `getBoundingClientRect()`
- 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出

 
``` JS
const imgs = document.getElementsByTagName('img')
// 获取可视区域的高度
const viewHeight = window.innerHeight || document.documentElement.clientHeight
// num用于统计当前显示到了哪一张图片，避免每次都从第一张图片开始检查是否露出
let num = 0

function lazyload() {
  // 注意这 i = num
  for (let i = num; i < imgs.length; i++) {
    // 用可视区域高度减去元素顶部距离可视区域顶部的高度
    let distance = viewHeight - imgs[i].getBoundingClientRect().top
    // 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出
    if (distance >= 0) {
      // 给元素写入真实的src，展示图片
      imgs[i].src = imgs[i].getAttribute('data-src')
      // 前i张图片已经加载完毕，下次从第i+1张开始检查是否露出
      num = i + 1
    }
  }
}
// 节流
function throttle(fn,delay = 100){
  let timer = null
  return function () {
    if(timer){
      return
    }
    timer = setTimeout(() => {
        fn.apply(this,arguments)
        timer = null
      }, delay);
  }
}

// 初始加载图片
window.addEventListener('DOMContentLoaded',lazyload)
// 滑动加载图片
window.addEventListener('scroll', throttle(lazyload))
```


### SSR

- 服务端渲染：将网页和数据一起加载，一起渲染（快，首屏渲染）
- 服务端渲染有利于SEO和首屏渲染
- 服务器稀少而宝贵，服务端渲染不是首选方案，首屏渲染体验和 SEO 的优化方案却很多，先把能用的低成本“大招”都用完。除非网页对性能要求太高了，以至于所有的招式都用完了，性能表现还是不尽人意，这时候就可以考虑加几台服务器，把服务端渲染搞起来了
- 非SSR（前后分离项目）：先加载网页，在加载数据，在渲染数据
- 早先的 jsp、asp、php 都是SSR，现在的vue react SSR

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

## webpack 性能优化
### 加速编译，提高CPU利用率

- 优化babel-loader，配置缓存和限定编译范围 include exclude
- happyPack 开启多线程编译，推荐使用 thread-loader 代替
- IgnorePlugin 忽略编译
- noParse 不解析

### 更好的开发体验

- 自动刷新
- 热更新
- DllPlugin

### 更高的产出代码质量

- 小图片base64编码
- bundle加hash
- 懒加载
- 提取公共代码
- 使用cdn加速
- IgnorePlugin
- 使用mode模式配置成production
- scope hosting
- 图片压缩
- parallelUglifyPlugin 启用多进程压缩代码，开多进程也需要消耗性能，所以按需使用，推荐使用 terser-webpack-plugin 配置 parallel=true 开启多进程







## 性能检测

### Performance 面板
#### 简要分析
- FPS：这是一个和动画性能密切相关的指标，它表示每一秒的帧数。图中绿色柱状越高表示帧率越高，体验就越流畅。若出现红色块，则代表长时间帧，很可能会出现卡顿。
- CPU：表示CPU的使用情况，不同的颜色片段代表着消耗CPU资源的不同事件类型
- NET：粗略的展示了各请求的耗时与前后顺序
#### 性能瓶颈挖掘 
但一般来说，我们会主要去看 Main 栏目下的火焰图和 Summary 提供给我们的饼图——这两者和概述面板中的 CPU 一栏结合，可以帮我们迅速定位性能瓶颈
![Performance 面板](https://user-gold-cdn.xitu.io/2018/10/7/1664d9d24ee5bd4e?imageView2/0/w/1280/h/960/ignore-error/1)

- 先看 CPU 图表和 Summary 饼图。CPU 图表中，我们可以根据颜色填充的饱满程度，确定 CPU 的忙闲，进而了解该页面的总的任务量。而 Summary 饼图则以一种直观的方式告诉了我们，哪个类型的任务最耗时（从本例来看是脚本执行过程）。这样我们在优化的时候，就可以抓到“主要矛盾”，进而有的放矢地开展后续的工作了。
- 再看 Main 提供给我们的火焰图。这个火焰图非常关键，它展示了整个运行时主进程所做的每一件事情（包括加载、脚本运行、渲染、布局、绘制等）。x 轴表示随时间的记录。每个长条就代表一个活动。更宽的条形意味着事件需要更长时间。y 轴表示调用堆栈，我们可以看到事件是相互堆叠的，上层的事件触发了下层的事件
- CPU 图标和 Summary 图都是按照“类型”给我们提供性能信息，而 Main 火焰图则将粒度细化到了每一个函数的调用。到底是从哪个过程开始出问题、是哪个函数拖了后腿、又是哪个事件触发了这个函数，这些具体的、细致的问题都将在 Main 火焰图中得到解答。

### LightHouse
会生成一份评估报告，主要内容是 页面性能、PWA（渐进式 Web 应用）、可访问性（无障碍）、最佳实践、SEO 五项指标的跑分
![整体的跑分情况](https://user-gold-cdn.xitu.io/2018/10/7/1664dc4798ee8992?imageView2/0/w/1280/h/960/ignore-error/1)
向下拉动 Report 页，我们还可以看到每一个指标的细化评估:
![指标的细化评估](https://user-gold-cdn.xitu.io/2018/10/7/1664dc86aeeda780?imageView2/0/w/1280/h/960/ignore-error/1)
在“Opportunities”中，LightHouse 甚至针对我们的性能问题给出了可行的建议、以及每一项优化操作预期会帮我们节省的时间

可以通过命令行使用 LightHouse，同样可以得到一份性能分析报告！
```bash
npm install -g lighthouse
lighthouse http://xxx.com
```
### Performance API

performance 是一个全局对象。在控制台里输入 window.performance，就可一窥其全貌：
![window.performance](https://user-gold-cdn.xitu.io/2018/10/7/1664dd8ec761f69f?imageView2/0/w/1280/h/960/ignore-error/1)

#### 关键时间节点

在 performance 的 timing 属性中，可以查看到如下的时间戳：
![timing](https://user-gold-cdn.xitu.io/2018/10/7/1664dddde131e37a?imageView2/0/w/1280/h/960/ignore-error/1)

这些时间戳与页面整个加载流程中的关键时间节点有着一一对应的关系
![对应的关系](https://user-gold-cdn.xitu.io/2018/10/7/1664ddd4e3df9a14?imageView2/0/w/1280/h/960/ignore-error/1)

通过求两个时间点之间的差值，可以得出某个过程花费的时间
``` JS
const timing = window.preformance.timing
// DNS消耗时间
timing.domainLookupEnd - timing.domainLookupStart
// TCP连接时间
timing.connectEnd - timing.connectStart
// 内容加载耗时
timing.responseEnd - timing.responseStart
```
除了这些常见的耗时情况，我们更应该去关注一些**关键性能指标**：`firstbyte`、`fpt`、`tti`、`ready` 和 `load` 时间。这些指标数据与真实的用户体验息息相关，是我们日常业务性能监测中不可或缺的一部分：
``` JS
// firstbyte：首包时间
timing.responseStart - timing.domainLookupStart
// fpt：First Paint Time, 首次渲染时间 / 白屏时间
timing.responseEnd - timing.fetchStart
// tti：Time to Interact，首次可交互时间
timing.domInteractive - timing.fetchStart
// ready：HTML 加载完成时间，即 DOM 就位的时间
timing.domContentLoaded - timing.fetchStart
// load：页面完全加载时间
timing.loadEventStart - timing.fetchStart
```
以上这些通过 `Performance API` 获取到的时间信息都具有较高的准确度。可以对此进行一番格式处理之后上报给服务端，也可以基于此去制作相应的统计图表，从而实现更加精准、更加个性化的性能耗时统计。

此外，通过访问 `performance` 的 `memory` 属性，我们还可以获取到`内存占用相关的数据`；通过对 `performance` 的其它属性方法的灵活运用，我们还可以把它耦合进业务里，实现更加多样化的性能监测需求——灵活，是可编程化方案最大的优点。

推荐阅读
- [Performance 官方文档](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/)
- [MDN Performance API 介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)
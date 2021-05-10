---
title: 手写代码/原理图系列
date: 2021-04-05
tags: 
- JavaScript
categories: 
- 文章
---

## 原生方法

### call/apply
``` JS
// call
Function.prototype.MyCall = function (ctx, ...args) {
  const fn = Symbol("fn")
  ctx[fn] = this
  //重点代码，利用this指向，相当于context.caller(...args)
  let res = ctx[fn](...args)
  delete ctx[fn]
  return res
}
// apply
Function.prototype.maApply = function (ctx, args) {
  const fn = Symbol("fn")
  ctx[fn] = this
  //重点代码，利用this指向，相当于context.caller(...args)
  const res = ctx[fn](...args)
  delete ctx[fn]
  return res
}
```

### bind

```js
// 第一个参数是this绑定对象，后面参数是传给被绑定对象的参数
Function.prototype.bind2 = function () {
  // 将参数拆解为数组
  const args = Array.prototype.slice.call(arguments)
  const t = args.shift() // 获取this
  const self = this // 被绑定函数
  return function () {
    return self.apply(t, args)
  }
}
```

### instanceof
Object.prototype.toString.call() 判断类型最准
``` JS
// 逐层向上查找原型，如果最终原型为null，证明不存在原型链中，否则就是存在
function myInstanceof (left,right){
  // 基础类型返回false
  if(typeof left !== 'object' || left === null){
    return false
  }

  let proto = Object.getPrototypeOf(left)

  while(true){
    if( proto === null ){ return false }
    if( proto === right.prototype){ return true }
    proto = Object.getPrototypeOf(proto)
  }
}

// or

function instanceof (left,right) {
  // 基础类型返回false
  if(typeof left !== 'object' || left === null){
    return false
  }

  let p = left
  while (p) {
    if(p === right.prototype){ return true }
    p = p.__proto__
  }

  return false
}
```

### Object.create
``` JS
const myCreate = function(proto){
  function F() {}
  F.prototype = proto
  F.prototype.constructor = F
  return new F() // 创建一个继承 obj 原型的纯净对象
}
```

### new
1. 创建一个全新的对象，这个对象的`__proto__`要指向构造函数的原型对象
2. 执行构造函数
3. 返回object类型，则最为 new 方法的返回值返回，否则返回上述全新对象
``` JS
function myNew(fn,...args) {
  const instance = Object.create(fn.prototype)
  const res = fn.apply(instance,args)
  return typeof res === 'object' ? res : instance
}
```

### 柯里化
``` JS
// 求长方形面积
functionn getArea(width,height){
  return width * height
}
// 如果遇到宽都是同一个值时
const area1 = getArea(10,20)
const area2 = getArea(10,30)
const area3 = getArea(10,40)
// 使用 闭包柯里化 计算面积
function getArea(width){
  return height=>{
    return width * height
  }
}

const getTenWidthArea = getArea(10)

// 之后碰到宽度为10的长方形就可以这样计算面积
const area1 = getTenWidthArea(20)
const area2 = getTenWidthArea(30)
const area3 = getTenWidthArea(40)
```

## 数组

### 去重
``` JS
// 传统方式
function unique(arr) {
  const res = []
  // 遍历，如果item不在res中就插入数据
  arr.forEach(item=>{
    if(res.indexOf(item) < 0){
      res.push(item)
    }
  })
  return res
}


//使用 Set 无序结构，不能重复，效率高
function unique(arr){
  return [... new Set(arr)]
}
```

### 排序

### map
1. 不修改原来数组
2. 回调函数的参数有哪些，返回值如何处理
``` JS
Array.prototype.myMap = function (fn, ctx) {
  var arr = Array.prototype.slice.call(this) // this 指向数组对象，如[1,3,4].myMap() 这个this指向 [1,3,4]
  var arrMap = []
  for (var i = 0; i < arr.length; i++) {
    // 回调参数 当前项数据、索引、自身数组数据
    arrMap.push(fn.call(ctx, arr[i], i, this))
  }
  return arrMap
}

[1,2,3].myMap(item=> item * 2) // [2,4,6]
```

### reduce
1. 初始值不传怎么处理
2. 回调函数的参数有哪些，返回值如何处理
``` JS
Array.prototype.myReduce = function (fn, initValue) {
  var arr = Array.prototype.slice.call(this)
  var res, startIndex

  res = initValue ? initValue : arr[0]
  startIndex = initValue ? 0 : 1

  for (var i = startIndex; i < arr.length; i++) {
    // reduce 核心代码
    res = fn.call(null, res, arr[i], i, this)
  }

  return res
}
```

### filter

### flatern
``` JS
// 拍平数组
function flat(arr) {
  const isDeep = arr.some(item => item instanceof Array)
  if (!isDeep) { return arr } // 递归结束条件
  // 利用concat可以拍平数组功能，递归拍平所有数据
  const res = Array.prototype.concat.apply([], arr)
  return flat(res) // 递归
}
```


## 原型

### 原型、原型链原理图
![原型、原型链](/img/原型链.jpg)

### 寄生组合继承
### Class 私有属性

## 设计模式

### 订阅发布模式
### 观察者模式
### 代理模式
### 装饰器模式
### 工厂模式
### 策略模式

## 框架

### React
#### 生命周期
![react 生命周期](/img/react生命周期.png)
- [组件生命周期图](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
#### setState主流程图
![setState主流程](/img/setState主流程.png)
#### redux数据流图
![redux数据流图](/img/redux.jpg)
#### 事件合成流程图
![事件合成流程图](/img/事件合成流程.png)
#### transaction事务机制
![transaction（事务）机制](/img/transaction事务机制.png)

### Vue
#### 响应式原理
``` JS
// 触发更新视图
function updateView() {
    console.log('视图更新')
}

// 重新定义数组原型
const oldArrayProperty = Array.prototype
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(methodName => {
    arrProto[methodName] = function () {
        updateView() // 触发视图更新
        oldArrayProperty[methodName].call(this, ...arguments)
        // Array.prototype.push.call(this, ...arguments)
    }
})

// 重新定义属性，监听起来
function defineReactive(target, key, value) {
    // 深度监听
    observer(value)

    // 核心 API
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                // 深度监听
                observer(newValue)

                // 设置新值
                // 注意，value 一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
                value = newValue

                // 触发更新视图
                updateView()
            }
        }
    })
}

// 监听对象属性
function observer(target) {
    if (typeof target !== 'object' || target === null) {
        // 不是对象或数组
        return target
    }

    // 污染全局的 Array 原型
    // Array.prototype.push = function () {
    //     updateView()
    //     ...
    // }

    if (Array.isArray(target)) {
        target.__proto__ = arrProto
    }

    // 重新定义各个属性（for in 也可以遍历数组）
    for (let key in target) {
        defineReactive(target, key, target[key])
    }
}

// 准备数据
const data = {
    name: 'zhangsan',
    age: 20,
    info: {
        address: '北京' // 需要深度监听
    },
    nums: [10, 20, 30]
}

// 监听数据
observer(data)

// 测试
// data.name = 'lisi'
// data.age = 21
// // console.log('age', data.age)
// data.x = '100' // 新增属性，监听不到 —— 所以有 Vue.set
// delete data.name // 删除属性，监听不到 —— 所有已 Vue.delete
// data.info.address = '上海' // 深度监听
data.nums.push(4) // 监听数组

```

#### 生命周期
![vue生命周期](https://cn.vuejs.org/images/lifecycle.png)
#### 响应式原理图
![响应式原理](https://cn.vuejs.org/images/data.png)
#### vuex流程图
![vuex 关系图](https://vuex.vuejs.org/vuex.png)

### js 模拟 vnode

```html
<div id="div1" class='container'>
  <p>dom</p>
</div>
```
``` JS
const vnode = {
  tag: "div",
  props:{
    id: "div1",
    className: "container"
  },
  childen:[
    {
      tag: "p",
      children: "dom"
    }
  ]
}
```


### 将 vnode 转为真实 dom
``` JS
function render(vnode, container) {
  container.appendChild(_render(vnode))
}

function _render(vnode) {
  // 数字型转为字符型
  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }
  // 字符型直接返回文本类型节点
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }
  // 普通dom
  const dom = document.createElement(vnode.tag)

  if (vnode.props) {
    for (let key in vnode.props) {
      if (key === 'className') {
        // 配置class属性
        dom.setAttribute('class', vnode.props[key])
      } else if(key === 'style' && typeof vnode.props[key] === 'object') {
        // style属性如果是 object 类型数据，遍历配置style属性
        Object.keys(vnode.props[key]).map(prop=>{
          dom.style[prop] =  vnode.props[key][prop]
        })
      }else {
        // 配置属性
        dom.setAttribute(key, vnode.props[key])
      }
    }
  }
  
  if (vnode.children) {
    if(Array.isArray(vnode.children)){
      vnode.children.forEach(child => {
        render(child, dom) // 递归
      })
    }else {
      // 如果 children 是文本直接渲染
      render(vnode.children, dom)
    }
  }

  return dom
}
```

## 工具类库

### 简易ajax
``` JS
function ajax(url, method = 'GET', data = null, async = true) {

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, async)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 304) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(new Error(`${xhr.status} ${xhr.responseText}`))
        }
      }
    }

    xhr.send(method === 'GET' ? null : JSON.stringify(data))
  })
}
```

### 简易JQuery
``` JS
class JQuery {
  constructor(selector) {
    const el = document.querySelectorAll(selector)
    const length = el.length
    for (let i = 0; i < length; i++) {
      this[i] = el[i]
    }
    this.length = length
    this.selector = selector
  }
  get(index) {
    return this[index]
  }
  each(fn) {
    for (let i = 0; i < this.length; i++) {
      fn(this[i])
    }
  }
  on(type, fn) {
    this.each((el) => {
      el.addEventListener(type, fn, false)
    })
  }
}

// 插件
JQuery.prototype.dialog = function (index) {
  alert(this[index])
}
// ”造轮子“
class MyJQuery extends JQuery {
  constructor(selector) {
    super(selector)
  }
  addClass(name) {
    // ...
  }
}
```

### lodash isEqual
``` JS
function isEqual(obj1, obj2) {

  function isObject(obj) {
    return typeof obj === 'object' && obj != null
  }
  
  // 1. 如果有个不是对象或数组
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2
  }

  // 2. 两个对象是同一个
  if (obj1 === obj2) {
    return true
  }

  // 比较两个对象 key 个数
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)

  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }

  // 3. 以 obj1 为基准，和 obj2 进行一次递归比较
  for (let key in obj1) {
    // 比较当前 key 的 val -- 递归！！！
    const res = isEqual(obj1[key], obj2[key])
    if (!res) {
      return false
    }
  }

  // 4. 全相等
  return true
}
```

## 功能/场景应用

### 图片懒加载
```html
<div>
    <img src="default.jpg" data-src="https://user-gold-cdn.xitu.io/2019/5/27/16af82bc7ddcdc22?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" alt="" width="100%" height="500px">
    <img src="default.jpg" data-src="https://cn.vuejs.org/images/lifecycle.png" alt="" width="100%" height="500px">
    <img src="default.jpg" data-src="https://vuex.vuejs.org/vuex.png" alt="" width="100%" height="500px">
  </div>
```
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

### 防抖、节流
``` JS
// 防抖
function debounce(fn,delay = 100){
  let timer = null
  return function () {
    if(timer){
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this,arguments)
      timer = null
    }, delay);
  }
}
```
``` JS
// 节流普通版
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
```


### 解析url
``` JS
function parseUrl(url) {
  // scheme://user:passwd@ 部分
  let schemeStr = '(?:([^/?#]+))?//(?:([^:]*)(?::?(.*))@)?',
    // host:port path?query 部分
      urlStr = '(?:([^/?#:]*):?([0-9]+)?)?([^?#]*)(\\?(?:[^#]*))?',
    // #fragment 部分
    fragmentStr = '(#(?:.*))'
      
  let pattern = RegExp(`^${schemeStr}${urlStr}${fragmentStr}?`)
  let matched = url.match(pattern) || []
  return {
    protocol: matched[1], // 协议
    username: matched[2], // 用户名
    password: matched[3], // 密码
    hostname: matched[4], // 主机
    port: matched[5],     // 端口
    pathname: matched[6], // 路径
    search: matched[7],   // 查询字符串 queryString
    hash: matched[8],     // 锚点
  }
}

// 或者
const url = new URL('http://www.baidu.com?user=xxx#hass')

// 参数解析方法1
function queryToObj(query){
  const res = {}
  if(query.indexOf('?') > -1){
    query = query.substr(1)
  }
  query.split('&').forEach(item=>{
    const param = item.split('=')
    res[param[0]] = param[1]
  })
  return res
}
// 参数解析方法2
function queryToObj(query){
  const res = {}
  const pList = new URLSearchParams(query)
  pList.forEach((val,key)=>{
    res[key] = val
  })
  return res
}
```

### 浅拷贝、深拷贝
``` JS
function deepclone (obj){
    if(typeof obj !== 'object' || obj == null){
        return obj
    }
    
    let result = Array.isArray(obj) ? [] : {}
    
    for(let key in obj){
        // 是否是自身（非继承）属性
        if(obj.hasOwnProperty(key)){
            result[key] = deepclone(obj[key]) // 递归
        }
    }
    
    return result
}
```
``` JS
function shallowClone (obj){
  if(typeof obj === 'object' && obj != null){
    let result = Array.isArray(obj) ? [] : {} 

    for (let key in obj) {
      // 是否是自身（非继承）属性
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key] // 只拷贝第一层数据
      }
    }

    return result
  }

  return obj
}
```

### jsonp

- 利用 `<script>` 可以绕过同源策略功能
- 服务器返动态拼接数据
- 只能get传参

``` js
// promise 版本 jsonp
function jsonp(url, params, callbackName) {
  // 拼接参数和地址
  const genUrl = function () {
    let data = ''
    for (let key in params) {
      data += `${key}=${params[key]}&`
    }
    data += `callback=${callbackName}`
    return `${url}?${data}`
  }

  return new Promise((resolve, reject) => {
    callbackName = callbackName || Math.random().toString()
    
    const script = document.createElement('script')
    script.src = genUrl()
    document.body.appendChild(script) // 动态插入script标签，请求数据拼接在src上

    window[callbackName] = function (data) {
      document.body.removeChild(script) // 用完就删除插入的script标签
      resolve(data) // 返回数据
    }
  })
}
```


### 随机字符串
``` JS
function genRandomString(len){
  let str = ''
  for(;str.length < len; str += Math.random().toString(36).substr(2)){}
  return str.substr(0,len)
}
```

### 异步Promise系列

## 浏览器

### even-loop图
![even-loop图](/img/event-loop.png)
### 通用事件绑定方法
``` JS
// 通用事件绑定函数
function bindEvent(elem, type, selector, fn) {
  if (fn == null) {
    fn = selector
    selector = null
  }
  elem.addEventListener(type, (event) => {
    const target = event.target
    if (selector) {
      // 代理绑定
      if (target.matches(selector)) {
        fn.call(target, event)
      }
    } else {
      // 普通绑定
      fn.call(target, event)
    }
  })
}
```

### 事件代理

```html
<body>
  <div id="div1">
    <p id="p1">激活</p>
    <p>取消</p>
    <p>取消</p>
  </div>
  <div>
    <p>取消</p>
    <p>取消</p>
  </div>
</body>
<script>
  const div1 = document.getElementById('div1')
  const p1 = document.getElementById('p1')
  div1.addEventListener('click',function(e){
    // 代理
    console.log('取消',e.target);
  })
  p1.addEventListener('click',function(e){
    e.stopPropagation();// 阻止冒泡
    console.log('激活',e.target);
  })
</script>
```
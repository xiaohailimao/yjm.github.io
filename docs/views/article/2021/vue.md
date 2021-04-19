---
title: Vue
date: 2021-02-20
tags: 
- Vue
categories: 
- 文章
---
## 基础知识

- v-if/v-for 不能一起使用，v-for渲染级别比v-if高
- 遍历可以遍历数组和对象,对象对一个属性key

```html
<div v-for="(val,key,index) in obj" :key="key">
{{key}}={{val}}
</div>
```
- $event 是原生事件
- 事件被挂载到当前元素

## 自定义事件

- `$emit`
- `beforeDestroy`周期该做的处理：及时销毁自定义事件，否则可能造成内存泄露


## 组件通信

- 父子组件通信：`props/$emit`
- 兄弟组件通信：通过vue实例，`event.$on`,`event.$emit`


## 组件生命周期

- beforeCreate
- created：创建完实例，可以拿到this
- beforeMount
- mounted：页面渲染完可以拿到el
- activated: 配置 keepalive 时触发
- beforeUpdate
- updated
- deactivated
- beforeDestroy：解除绑定，销毁子组件以及事件监听
- destroyed

![生命周期](https://cn.vuejs.org/images/lifecycle.png)


## 嵌套组件生命周期

==子组件先渲染完成再渲染父组件，实例化和销毁组件父组件先完成后在完成子组件==

==mounted、activated、deactivated 子组件先执行，created、destroy父组件先执行==

created：先外到内触发，先实例化父组件在实例化子组件

mounted：先内到外触发，先渲染子组件再渲染父组件

updated：子组件触发事件，父组件监听到子组件事件然后变更父组件data数据，父组件先触发updated，父组件变更数据后传给子组件，子组件再触发updated

destroy：先销毁父组件再销毁子组件

deactivated：先内到外触发

## 自定义双向绑定

1. model

```js
export default {
    props:{
        value:String,
        required:true
    }
    model:{
        prop:"value",
        event:"change"
    },
    methods:{
        onClick(val){
            // model 自定义事件
            this.$emit('change',val)
        }
    }
}
```

```js
// 使用默认值，value,input可以作为双向绑定用
export default { 
    props:{
        value:String,
        required:true
    },
    methods:{
        onClick(val){
            // 默认input事件可以作为双向绑定用
            this.$emit('input',val)
        }
    }
}
```

2. sync

``` html
<template>
    <demo :value.sync="value" />
</template>

<script>
import Demo from "./demo"
export default {
    components:{
        Demo
    },
    data(){
        return {
            value: ""
        }
    }
}
</script>
```


```js {11}
// demo.vue
export default { 
    name:"demo",
    props:{
        value:String,
        required:true
    },
    methods:{
        onClick(val){
            // 默认input事件可以作为双向绑定用
            this.$emit('update:value',val)
        }
    }
}

```

## v-model 原理

- input元素的 `value = this.name`
- 绑定input事件，`this.name = $event.target.value`
- data 触发更新 re-render

## $nextTick

1. vue是异步渲染的，`$nextTick` 待DOM渲染完再回调
2. 页面渲染时会将 data 的修改做整合，多次 data 修改只会渲染一次

## slot

插槽作用域

```html
<!--定义-->
<slot :data="data" >
    这里是插槽默认值
</slot>

<!--应用-->
<template v-slot="scope">
    <div>这里可以取到插槽作用域传递的数据 scope.data </div>
</template>
```


具名插槽

```html
<!--定义-->
<slot name="header" />

<!--应用-->
<template v-slot:header>
    <div>插入 header 中的内容</div>
</template>
<!--缩写-->
<template #:header>
    <div>插入 header 中的内容</div>
</template>
```

## 动态组件

- `:is="component-name"` 用法
- 需要根据数据，动态渲染的场景，即组件类型不确定

```html {2}
<template>
    <component :is="componentName" />
</template>
<script>
import Com1 from "./Com1"
export default {
    data(){
        return {
            componentName: "Com1"
        }
    }
}
</script>
```

## 异步组件

- `import()` 函数
- 按需加载，异步加载组件

```js {3}
export default {
    components:{
        comp1: ()=> import("./comp1") // 异步加载
    }
}
```

## keepalive

- 缓存组件
- 频繁切换，不需要重复渲染

## mixin

- 提取多个组件共同逻辑

问题

- 变量来源不明确，不利阅读
- 多mixin可能会造成命名冲突
- mixin和组件可能出现多对多的关系，复杂度较高


## vuex

- Actions才可以进行异步操作

![vuex 关系图](https://vuex.vuejs.org/vuex.png)

## router

路由模式（hash、history）

```js {3} 
// history需要服务端支持，因此无特殊需要选择默认的hash模式
const router = new VueRouter({
    mode: "history", // h5 history 模式
    routes:[]
})
```

路由配置（动态路由、懒加载）

```js {4,10}
// 动态路由
// 获取参数如 10 20
const User = {
    template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
    routes: [
        // 动态路径参数 以冒号开头。能命中 '/user/10' '/user/20' 等格式的路由
        {  path: '/user/:id', component: User }
    ]
})
```

```js {4-8}
// 懒加载
const router = new VueRouter({
    routes: [
        { path: '/', component: => import(
        // webpack打包文件名称配置
        /* webpackChunkName: "comp1" */
        './comp1'
        )}
    ]
})
```

## 组件化基础（mvvm模型）

“很久以前”就有组件化

- asp，jsp，php已经有组件化
- nodejs有组件化
- 传统组件只是静态渲染，更新还有依赖于操作DOM

数据驱动视图（MVVM，setState）

- Vue MVVM
- React setState


**MVVM：model（数据层） view（视图层） viewModel（是个连接层）**

在操作DOM时代就有组件化，传统的组件化都是静态渲染，更新依赖于操作DOM，Vue 的 MVVM、React 的 setState 都是采用数据驱动视图，让我们可以只关心业务数据层面不在关系对DOM操作的细节，框架会帮我们自己操作

## vue 响应式

![响应式原理](https://cn.vuejs.org/images/data.png)

- vue2.0 核心API - Object.defineProperty

```js
// 监听对象
const data = {}
const name = 'lucy'
Object.defineProperty(data,'name',{
    get: function(){
        console.log('get')
        return name
    },
    set: function(newVal){
        console.log('set')
        name = newVal
    }
})

console.log(data.name) // get lucy 
data.name = 'zoro' // set
```

示例

```js {21,30,50,6-16}
// 更新视图
function updateView(){
  console.log('更新视图')
}

// 重新定义数组原型
const oldArrayProperty = Array.prototype
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
['push','pop','shift','unshift','splice'].forEach(methodName=>{
  arrProto[methodName] = function(){
      // 让数组也有响应事件
      updateView()
      oldArrayProperty[methodName].call(this,...arguments)
  }
})

// 重新定义属性，监听起来
function defineReactive(target,key,value){
  // 深度监听，当value为对象的时候给value做个深度监听
  observer(value)
  
  Object.defineProperty(target,key,{
      get(){
          return value
      },
      set(newValue){
          if(newValue !== value){
              // 深度监听， 当新值是个对象时给新增做个深度监听
              observer(value)
              // 设置新值
              // value 一直在闭包中，此处设置完了之后，在 get 时也会获取到最新的值
              value = newValue
              // 触发更新视图
              updateView()
          }
      }
  })
}

// 监听对象属性
function observer(target){
  if(typeof target !== 'object' || typeof target === null){
      // 不是对象或者数组
      return target
  }
  
  // 如果是数组，把数组的原型指向自定义的原型对象上
  if(Array.isArray(target)){
      target.__proto__ = arrProto
  }
  
  // 重新定义各个属性，for in 可以遍历和对象
  for(key in target){
      defineReactive(target,key,target[key])
  }
}

// 准备数据
const data = {
  name: 'lucy',
  info:{
      address: '厦门' // 需要深度监听
  },
  num: [1,3,4] // 数组监听
}

// 监听数据
observer(data)

data.name = 'zoro'
data.info.address = '深圳'
data.num.push(1)
```

- 缺点
  - 深度监听，需要递归到底，一次性计算量大
  - 无法监听新增/删除属性(Vue.set Vue.delete)

- vue3.0 核心API - Proxy
  - 兼容性不太好，无法用 polyfill


## 虚拟dom（vdom）

- 操作dom很耗性能
- 有了一定的复杂度，想减少计算次数比较难
- 把计算更多的转移到js中计算？js计算速度快
- vdom-用js模拟DOM结构(vnode)，计算出最小变更，然后操作DOM
- 新旧vnode对比，得出最小更新范围，最后更新DOM
- 数据驱动视图的模式下，有效控制DOM操作

用js模拟一个dom结构

``` html
<div id="one" class="container">
    <p>vdom</p>
    <ul style="font-size: 20px">
        <li>a</li>
    </ul>
</div>
```
注意事项：必须包含3个字段，tag 标签名、props 标签的属性配置 、children 节点子内容，样式名用 className 表示

```js
// vnode
{
    tag: 'div',
    props: {
        id: 'one',
        className: 'container'
    },
    children:[
       {
           tag: 'p',
           children: 'vdom'
       },
       {
           tag: 'ul',
           props: {
               style: 'font-size: 20px'
           },
           children: [
            {
                tag: 'li',
                children: 'a'
            }
           ]
       }
    ]
}
```

## diff算法

diff树算法时间复杂度O(n^3) 不可用，优化到O(n)

算法优化

- 只比较同一层级，不跨级比较
- tag不同，则直接删掉，不在深度比较
- tag和key，两者都相同，则认为是相同节点，不在深度比较

核心api

- `patchVnode`
- `addVnodes`、`removeVnodes`
- `updateChildren` (key重要性)

处理流程

patch：

- 调用`patch`时会执行响应的hook
- 如果第一个参数不是`vnode`就创建一个空的`vnode`关联到这个DOM元素
- 如果两参数都是`vnode`并且`key`和`sel`相同就进入`vnode`对比调用`patchVnode` 
- 如果新旧`vnode`不同就删掉重建

patchVnode：

- 如果`text`有值则`children`一般没值，就移除旧的`children`设置新的`text`值
- 如果`children`有值在进去判断
  - 新旧都有`children` 就调用 `updateChildren`
  - 新 `children` 有，旧 `children` 无， 就清空`text` 调用 `addVnodes` 添加新的
  - 旧 `children` 有，新 `children` 无， 就调用 `removeVnodes` 删除 `children` 
  - 旧 `text` 有, 清空 `text`

updateChildren：

- 开始和开始对比
- 结束和结束对比
- 开始和结束对比
- 结束和开始对比
- 以上四个都未命中拿新节点 key ，能否对应上 oldCh 中的某个节点的 key 
  - 没对应上就插入新el
  - key对应上当sel不相等就插入新el
  - key对应上sel相等就调用 `patchVnode`

概念

- 细节不重要，updateChildren 的过程也不重要，不要深究
- vdom核心概念：`h`、`vnode`、`patch`、`diff`、`key`等
- vdom存在的价值：数据驱动视图，控制DOM操作

## 模板编译

with语法

- 改变 `{}` 内自由变量的查找方式，当做`obj属性`来查找
- 如果匹配不到obj属性，会报错
- with要慎用，它打破了作用域规则，易读性变差

```js
const obj = {
    a: "a",
    b: "b"
}

// 使用 with ，能改变 { } 中自由变量的查找方式
// 将 {} 中的自由变量，当做 obj 的属性来查找 

with(obj){
    console.log(a) // a
    console.log(b) // b
    console.log(c) // 报错
}
```

编译步骤

- 使用模板编译工具 `vue-template-compiler` 将template模板代码编译成`render函数`，render函数执行返回一个`vnode`
- 基于`vnode`在执行`patch`和`diff`
- 使用 webpack vue-loader ，在开发环境下编译模板（重要）

## vue组件是如何渲染和更新的

初次渲染过程

- 解析为`render函数`（或在开发环境已完成，vue-loader）
- 触发响应式，监听 `data` 属性 `getter`、`setter`
- 执行`render函数`，生成`vnode`、`patch(el，vnode)`

*注意：未在模板中使用的data的属性变化是不会触发视图变化*

更新过程

- 修改 `data` ，触发 `setter`
- 重新执行 `render函数`，生成 `newVnode`
- `patch(vnode,newVnode)`

## 为何采用异步渲染

- `$nextTick`
- 汇总 `data` 的修改，一次更新视图
- 减少DOM操作次数，提高性能
 

## 前端路由原理

url 组成部分

```js
// http:127.0.0.1:8080/user?name=lucy&age=20#/info
location.protocol // http:
location.hostname // 127.0.0.1
location.host // 127.0.0.1:8080
location.port // 8080
location.pathname // /user
location.search // ?name=lucy&age=20
location.hash // #/info
```

hash 特点

- hash变化会触发页面跳转，即浏览器的前进和后退
- hash变化不会刷新页面，**SPA必需的特点**
- hash永远不会提交到server端（前端自生自灭）

hash 触发变化（`onhashchange`）

- js修改url hash值
- 手动修改url hash值
- 浏览器前进后退

```js {2}
// 监听hash变化
window.onhashchange = function(event){
    console.log('old url',event.oldURL)
    console.log('new url',event.newURL) 
    console.log('hash',location.hash)
}
// 首次加载获取hash值
document.addEventListener('DOMContentLoaded',()=>{
    console.log('hash',location.hash)
})
```

h5 history

- 用url的规范路由，当页面跳转不刷新页面
- **history.pushState**
- **window.onpopstate** 监听前进后退
- 需要后端支持

hash与h5 history 选取

- to B系统推荐用hash，简单易用，对url不敏感
- to C系统可以考虑用history，当要服务端支持
- 能选择简单的就别用复杂的，考虑成本和收益

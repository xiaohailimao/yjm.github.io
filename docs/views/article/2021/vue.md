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
- beforeUpdate：不要在这个周期修改data，否则会死循环，data数据修改用 `computed` 和 `watch` 代替
- updated：不要在这个周期修改data，否则会死循环，data数据修改用 `computed` 和 `watch` 代替，使用 `$nextTick` 代替 `update`,`this.$nextTick()` 可以用作局部的数据更新后DOM更新结束后的操作，全局的可以用 `updated` 生命周期函数
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
- 组件实现
- 渲染机制和生命周期

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

在操作DOM时代就有组件化，传统的组件化都是静态渲染，更新依赖于操作DOM，Vue 的 MVVM、React 的 setState 都是采用数据驱动视图，让我们可以只关心业务数据层面不在关心对DOM操作的细节，框架会帮我们自己操作

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
              observer(newValue)
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
  if(typeof target !== 'object' || target == null){
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

patchVnode：`text`和`children`互斥关系，不会同时存在

- `text`有值，就移除旧的`children`设置新的`text`值
- `children`有值
  - 旧有 `children`,调用 `updateChildren`
  - 旧无 `children`,调用 `addVnodes` 添加新的
- `children`无值
  - 旧有 `children` ， 就调用 `removeVnodes` 删除 `children` 
  - 旧有 `text` , 清空 `text`

updateChildren：

![updateChildren](/img/updateChildren.png)
减少循环次数
- 开始和开始对比
- 结束和结束对比
- 开始和结束对比
- 结束和开始对比
- 以上四个都未命中拿新节点 key ，能否对应上 oldCh 中的某个节点的 key 
  - 没对应上就插入新el
  - key对应上当sel不相等就插入新el
  - key对应上sel相等就调用 `patchVnode`

![使用key和不使用key](/img/使用key和不使用key.png)

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

## 为什么data是个函数

- vue组件是个class，每个地方去使用这个vue组件其实就是去实例化这个class，data是函数就组件直接的data数据不会互相影响

## ajax请求放在哪个生命周期

- `mounted`
- js是单线程的，ajax是异步获取数据
- 放在 `mounted` 之前没什么用，只会让逻辑更乱

## 将组件所有props传递给子组件

- `$props`
- `<User v-bind="$props" />`

## 何时使用beforeDestroy

- 解除自定义绑定事件event.$off
- 清除定时器
- 解绑自定义的DOM事件，如window.scroll等

## vuex中action和mutation有何区别

- action中可以处理异步，mutation中不可以
- mutation做原子操作
- action可以整合多个mutation

## vue如何监听数组变化

- Object.defineProperty无法监听数组
- 重新定义数组原型，重新push，pop等方法实现监听
- proxy可以原生监听数组

## 请描述响应式原理

- 监听data变化
- 组件渲染和更新过程 

## diff算法时间复杂度

- O(n)
- 在O(n^3)基础上做的调整

## 简述diff算法过程

- patch(element,vnode) 和 patch(vnode,newVnode)
- patchVnode、addVnodes、removeVnodes
- updateChildren（key的重要性，根据tag和key判断是不是sameVnode）

## vue为何是异步渲染，$nextTick有何用

- 异步渲染（以及合并data修改），以提渲染高性能
- $nextTick是DOM更新后触发

## vue常见的性能优化

- 合理使用computed计算
- 合理使用v-if和v-show
- v-for时key，避免和v-if同时使用
- 自定义事件和DOM事件及时销毁
- 合理使用异步组件
- 合理使用keepalive
- data层级不要太深
- 使用vue-loader在开发环境进行模板编译（预编译）
- webpack层面优化
- 前端通用的性能优化，如图片懒加载
- 使用SSR
 

 ## vue3 比 vue2 有哪些优势？

 - 性能更好
 - 更好ts支持
 - 更好的代码组织
 - 更好的逻辑抽离
 - 更多新功能
 - 体积更小

 ## vue3 和 vue2 的生命周期有什么区别？

 - options API 生命周期
   - beforeDestroy 改为 beforeUnmount
   - destroyed 改成 unmounted
   - 其他的沿用vue2的生命周期
- composition API 生命周期
  - setup：等于 beforeCreate 和 created
  - onBeforeMount
  - onMounted
  - onBeforeUpdate
  - onUpdated
  - onBeforeUnmount
  - onUnmounted

``` JS
import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from "vue"
export default {
    // 等于 beforeCreate 和 created
    setup(){
        onBeforeMount(()=>{
            console.log('onBeforeMount');
        })
    },
    // beforeDestroy 改名
    beforeUnmount() {
        
    },
    // destroyed 改名
    unmounted() {
        
    },
}
```
## Composition API 对比 Options API

- Composition API 带来了什么
  - 更好的代码组织
  - 更好的逻辑复用
  - 更好的类型推导
- Composition API 和 Options API 如何选择
  - 不建议共用，会引起混乱
  - 小型项目，业务逻辑简单，用 Options API
  - 中大型项目，业务逻辑复杂，用 Composition API
- 别误解 Composition API
  - Composition API 属于高阶技巧，不是基础必会
  - Composition API 是为了解决复杂业务逻辑而设计
  - Composition API 就像 Hooks 在 React 中的地位

## 如何理解 ref toRef 和 toRefs
### ref

- 生成**值类型**的响应式数据
- 可用于 `模板` 和 `reactive`
- 通过 `.value` 修改值

``` html
<template>
    <p>ref demo {{ageRef}} {{state.name}}</p>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
    name: 'Ref',
    setup() {
        const ageRef = ref(20) // 值类型 响应式
        const nameRef = ref('姓名')

        const state = reactive({
            name: nameRef
        })

        setTimeout(() => {
            console.log('ageRef', ageRef.value)

            ageRef.value = 25 // .value 修改值
            nameRef.value = '姓名A'
        }, 1500);

        return {
            ageRef,
            state
        }
    }
}
</script>
```
    
### toRef

- 针对一个`响应式对象`(`reactive`封装)的 prop
- 创建一个ref，具有响应式
- 两者保持引用关系
- 如果用于普通对象（非响应式对象），产出的结果不具备响应式

``` HTML
<template>
    <p>toRef demo - {{ageRef}} - {{state.name}} {{state.age}}</p>
</template>

<script>
import { ref, toRef, reactive } from 'vue'

export default {
    name: 'ToRef',
    setup() {
        const state = reactive({
            age: 20,
            name: '姓名'
        })

        const age1 = computed(() => {
            return state.age + 1
        })

        // // toRef 如果用于普通对象（非响应式对象），产出的结果不具备响应式
        // const state = {
        //     age: 20,
        //     name: '姓名'
        // }

        const ageRef = toRef(state, 'age')

        setTimeout(() => {
            state.age = 25
        }, 1500)

        setTimeout(() => {
            ageRef.value = 30 // .value 修改值
        }, 3000)

        return {
            state,
            ageRef
        }
    }
}
</script>
```

### toRefs

- 将响应式对象(reactive封装)转换为普通对象
- 对象的每个prop都是对应的ref
- 两者保持引用关系
``` HTML
<template>
    <p>toRefs demo {{age}} {{name}}</p>
</template>

<script>
import { ref, toRef, toRefs, reactive } from 'vue'

export default {
    name: 'ToRefs',
    setup() {
        const state = reactive({
            age: 20,
            name: '姓名'
        })

        const stateAsRefs = toRefs(state) // 将响应式对象，变成普通对象

        // const { age: ageRef, name: nameRef } = stateAsRefs // 每个属性，都是 ref 对象
        // return {
        //     ageRef,
        //     nameRef
        // }

        setTimeout(() => {
            state.age = 25
        }, 1500)

        return stateAsRefs
    }
}
</script>
```

### 最佳使用方式

- 用 `reactive` 做`对象的响应式`，用 `ref` 做`值的响应式`
- setup 中返回 toRefs(state)，或者 toRef(state,'xxx')
- ref 的变量用 xxxRef 命名
- 合成函数返回响应式对象，使用 toRefs

``` JS
import { toRefs, reactive } from 'vue'

export default {
    setup(){
        // 可以在不丢失响应式的情况下破坏结构
        const { x, y } = useFeatureX()
        return { x, y }
    }
}

function useFeatureX() {
    const state = reactive({
        x:1, y: 2
    })

    // ... 省了n行逻辑代码
    // 返回时转换为ref
    return toRefs(state)
}
```

### 进阶，深入理解

- 为什么需要用 `ref` ?
  - 返回值类型，会丢失响应式
  - 如在 setup、computed、合成函数都可能返回值类型
  - vue 如果不定义ref，用户将自造ref，反而混乱
- 为什么需要 `.value` ?
  - ref 是一个对象（不丢失响应式），value 存储值
  - 通过 `.value` 属性的 get 和 set 实现响应式
  - 用于`模板`、`reactive` 时，不需要 `.value`，其他情况都需要
- 为什么需要 toRef toRefs ？
  - 初衷：在`不丢失响应式`的情况下，把对象数据**分解/拆散**
  - 前提：针对响应式对象（reactive封装）非普通对象
  - 注意：**不创造**响应式，而是**延续**响应式

## vue3 升级了哪些重要的功能？

- createApp
- emits属性
- 生命周期
- 多事件
- fragment
- 移除 `.sync`
- 异步组件的写法
- 移除 filter
- teleport
- suspense
- composition API

## vue3 如何实现响应式

- vue2 的 Object.defineProperty
  - 深度监听需要**一次性**递归
  - 无法监听新增和删除属性（Vue.set Vue.delete）
  - 无法原生监听数组，需要特殊处理
- 学习 proxy 语法
  - 基本使用
  ``` JS
  const data = { a:1, b:2 }
  // 后继操作都在 proxyData 这个对象上
  const proxyData = new Proxy(data,{
      get(target,key,receiver){
          // receiver => proxyData
          // 只处理本身（非原型的）属性
          const ownKeys = Reflect.ownKeys(target)
          if(ownKeys.includes(key)){
            console.log('get',key); // 监听
          }

          const result = Reflect.get(target,key,receiver)
          return result // 返回结果
      },
      set(target,key,val,receiver){
          // receiver => proxyData
          // 重复数据不处理
          if(val === target[key]){
            return true
          }
          const result = Reflect.set(target,key,val,receiver)
          console.log('set',key);
          return result // 返回是否赋值成功，是 boolean 类型
      },
      deleteProperty(target,key){
          const result = Reflect.deleteProperty(target,key)
          console.log('deleteProperty',key);
          return result // 返回是否删除成功，是 boolean 类型
      }
  })
   
  ```
  - Reflect作用
    - 和proxy能力一一对应
    - 规范化、标准化、函数式
    - 代替Object上的工具函数
- vue3 如何用 proxy 实现响应式
  - 性能优化：`Proxy` 是在 `get` 的时候做递归获取那一层数据那一层才触发响应式，`Object.defineProperty` 方式是`在定义的时候`一次性递归
  - 深度监听，性能更好
  - 可监听新增和删除属性
  - 可监听数组变化

``` JS {11,26,28,16,42,36}
// 响应式监听函数
function reactive(target = {}) {
  // 不是对象或数组，则返回
  if (typeof target !== 'object' || target == null) {
    return target
  }

  const proxyConfig = {
    get(target, key, receiver) {
      const ownkeys = Reflect.ownKeys(target)
      if (ownkeys.includes(key)) {
        console.log('get', key); // 监听
      }

      const result = Reflect.get(target, key, receiver)
      // 深度监听
      return reactive(result)
    },
    set(target, key, val, receiver) {
      // 重复数据不处理
      if (val === target[key]) {
        return true
      }

      const ownkeys = Reflect.ownKeys(target)
      if (ownkeys.includes(key)) {
        console.log('set', key); // 监听修改
      } else {
        console.log('add', key); // 监听新增
      }

      const result = Reflect.set(target, key, val, receiver)
      // 深度监听
      return result
    },
    defineProperty(target, key) {
      console.log('defineProperty', key); // 监听删除
      const result = Reflect.defineProperty(target, key)
      return result
    }
  }

  const observed = new Proxy(target, proxyConfig)
  return observed
}

const data = {
  name: "xx",
  age: 20,
  info: {
    city: "xiamen"
  }
}

const proxyData = reactive(data)

console.log(proxyData.name);
console.log(proxyData.info.city);
proxyData.age = 30
delete proxyData.name
```

- 总结
  - 优点：深度监听性能更好、可监听数组变化、可监听删除和新增属性
  - 缺点：无法兼容所有浏览器，且无法polyfill



## watch 和 watchEffect 区别

- 两者都可以监听data属性变化
- watch需要明确监听哪个属性
- watchEffect会根据其中的属性，自动监听其变化

``` JS
import { ref, toRef, reactive, watch, watchEffect } from "vue"

export default {
    setup(){
        const numberRef = ref(200)
        const state = reactive({
            age: 20,
            name: 'xx'
        })

        // 监听ref数据
        watch(numberRef,(newNumberRef,oldNumberRef)=>{
            console.log('watch ref',newNumberRef,oldNumberRef);
        },{ immediate: true })

        // 监听reactive数据
        watch(
            () => state.age,
            (newVal,oldVal)=>{
                console.log('watch reactive',newVal,oldVal);
            }
        )

        watchEffect(()=>{
            // 初始化会执行一次，收集依赖数据
            console.log('watchEffect');
        })
        watchEffect(()=>{
            console.log('watchEffect age',state.age);
        })

        return {
            numberRef,
            ...toRefs(state)
        }
    }
}
```

## setup 中如何获取组件实例

- 在 `setup` 中和其他 `Composition API` 中没有 `this`
- 通过 `getCurrentInstance` 获取当前组件实例
- 如果使用 `Options API` 照常使用 `this`

## vue3 为何比 vue2 快

- Proxy 响应式
- PatchFlag
  - 编译模板时，动态节点做标记
  - 标记，分为不同的类型，如TEXT PROPS
  - diff算法时，可以区分静态节点，以及不同类型的动态节点
- hoistStatic
  - 将静态节点的定义，提升到父级作用域，缓存起来
  - 多个相邻的节点，会被合并起来
  - 典型的空间换时间的优化策略
- cacheHandler
  - 缓存事件
- SSR优化
  - 静态节点直接输出，绕过vdom
  - 动态节点还是需要动态渲染
- tree-shaking
  - 需要什么引入什么

## Vite 是什么
- 一个前端打包工具，Vue作者发起的项目
- 借助Vue的影响力，发展较快，和webpack竞争
- 优势：开发环境下无需打包，启动快
  - **开发环境下使用ES6 Module**，无需打包-非常快
  - 生产环境使用Rollup，并不会快很多
- ES6 Module
  - `<script type="module">`
  - 基本演示
  ``` HTML
    <script type="module">
        import add from './src/add.js'

        const res = add(1, 2)
        console.log('add res', res)
    </script>

    <script type="module">
        import { add, multi } from './src/math.js'
        console.log('add res', add(10, 20))
        console.log('multi res', multi(10, 20))
    </script>
  ```
  - 外链
  ``` HTML
  <script type="module" src="./src/index.js"></script>
  ```
  - 远程引用
  ``` HTML
    <script type="module">
        import { createStore } from 'https://unpkg.com/redux@latest/es/redux.mjs'
        console.log('createStore', createStore)
    </script>
  ```
  - 动态引入
  ``` HTML
  <body>
    <p>动态引入</p>
    <button id="btn1">load1</button>
    <button id="btn2">load2</button>

    <script type="module">
        document.getElementById('btn1').addEventListener('click', async () => {
            const add = await import('./src/add.js')
            const res = add.default(1, 2)
            console.log('add res', res)
        })
        document.getElementById('btn2').addEventListener('click', async () => {
            const { add, multi } = await import('./src/math.js')
            console.log('add res', add(10, 20))
            console.log('multi res', multi(10, 20))
        })
    </script>
  </body>
  ```
  
  
  
  

## vue3 注意事项

- vscode 插件 volar 语法提示插件
- 官方的 vue-tsc 命令行类型检测
- style 中使用 v-bind 绑定变量样式
- `<script setup>`
- vitePress md文档生成工具
- vite 脚手架
- vue3 不支持 IE11
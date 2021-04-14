---
title: vue-react-webpack
date: 2021-04-13
tags: 
- Vue
categories: 
- 文章
---


## Vue

### 基础知识

- v-if/v-for 不能一起使用，v-for渲染级别比v-if高
- 遍历可以遍历数组和对象,对象对一个属性key

```html
<div v-for="(val,key,index) in obj" :key="key">
{{key}}={{val}}
</div>
```
- $event 是原生事件
- 事件被挂载到当前元素

### 自定义事件

- `$emit`
- `beforeDestroy`周期该做的处理：及时销毁自定义事件，否则可能造成内存泄露


### 组件通信

- 父子组件通信：`props/$emit`
- 兄弟组件通信：通过vue实例，`event.$on`,`event.$emit`


### 组件生命周期

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


### 嵌套组件生命周期

==子组件先渲染完成再渲染父组件，实例化和销毁组件父组件先完成后在完成子组件==

==mounted、activated、deactivated 子组件先执行，created、destroy父组件先执行==

created：先外到内触发，先实例化父组件在实例化子组件

mounted：先内到外触发，先渲染子组件再渲染父组件

updated：子组件触发事件，父组件监听到子组件事件然后变更父组件data数据，父组件先触发updated，父组件变更数据后传给子组件，子组件再触发updated

destroy：先销毁父组件再销毁子组件

deactivated：先内到外触发

### 自定义双向绑定

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

### v-model 原理

- input元素的 `value = this.name`
- 绑定input事件，`this.name = $event.target.value`
- data 触发更新 re-render

### $nextTick

1. vue是异步渲染的，`$nextTick` 待DOM渲染完再回调
2. 页面渲染时会将 data 的修改做整合，多次 data 修改只会渲染一次

### slot

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

### 动态组件

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

### 异步组件

- `import()` 函数
- 按需加载，异步加载组件

```js {3}
export default {
    components:{
        comp1: ()=> import("./comp1") // 异步加载
    }
}
```

### keepalive

- 缓存组件
- 频繁切换，不需要重复渲染

### mixin

- 提取多个组件共同逻辑

问题

- 变量来源不明确，不利阅读
- 多mixin可能会造成命名冲突
- mixin和组件可能出现多对多的关系，复杂度较高


### vuex

- Actions才可以进行异步操作

![vuex 关系图](https://vuex.vuejs.org/vuex.png)

### router

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

### 组件化基础（mvvm模型）

“很久以前”就有组件化

- asp，jsp，php已经有组件化
- nodejs有组件化
- 传统组件只是静态渲染，更新还有依赖于操作DOM

数据驱动视图（MVVM，setState）

- Vue MVVM
- React setState


**MVVM：model（数据层） view（视图层） viewModel（是个连接层）**

在操作DOM时代就有组件化，传统的组件化都是静态渲染，更新依赖于操作DOM，Vue 的 MVVM、React 的 setState 都是采用数据驱动视图，让我们可以只关心业务数据层面不在关系对DOM操作的细节，框架会帮我们自己操作

### vue 响应式

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


### 虚拟dom（vdom）

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

### diff算法

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

### 模板编译

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

### vue组件是如何渲染和更新的

初次渲染过程

- 解析为`render函数`（或在开发环境已完成，vue-loader）
- 触发响应式，监听 `data` 属性 `getter`、`setter`
- 执行`render函数`，生成`vnode`、`patch(el，vnode)`

*注意：未在模板中使用的data的属性变化是不会触发视图变化*

更新过程

- 修改 `data` ，触发 `setter`
- 重新执行 `render函数`，生成 `newVnode`
- `patch(vnode,newVnode)`

### 为何采用异步渲染

- `$nextTick`
- 汇总 `data` 的修改，一次更新视图
- 减少DOM操作次数，提高性能
 

### 前端路由原理

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


## React

### jsx

- 富文本
- 样式名属性用 `className` 表示

``` jsx {3,7}
const rawHtml = `<span>raw html</span>`
const rawHtmlData = {
    __html: rawHtml // 注意这个 __html 必须用这个
}

const rawHtmlElem = <div>
    <p dangerouslySetInnerHTML={rawHtmlData}></p>
    <p>{rawHtml}</p>
</div>
```

### 事件

#### bind this

```js {5,10-13}
class CustomComponent extends React.Component {
    constructor(props){
        supper(props)
        // 1. bind
        this.onChange = this.onChange.bind(this)
    }
    onChange(){
        // 这里的this默认是undefined，需要通过bind绑定this
    }
    // 2. 静态方法，this指向当前实例
    onChange2 = () =>{
        // 这里的this 指向当前实例
    }
}
```

#### 关于event事件

- react 不是原生的，是 `SyntheticEvent` 组合事件，模拟出`DOM`事件所有能力
- vue 是原生`event`， 是 `MouseEvent`
- `event.nativeEvent` 获取原生event对象
- 所有的事件都被挂载到`document上`,和`DOM`事件不一样，和`vue`事件也不一样
- **React16事件绑定到document上**
- React17开始事件就不再绑定到 `document` 上了,绑定到root组件上了，有利于多个React版本共存，例如微前端

```jsx
class CustomComponent extends React.Component {
    constructor(props){
        supper(props)
    }
    // 2. 静态方法，this指向当前实例
    onClick = (event) =>{
        // 绑定事件不传参，第一个参数就被传event事件参数
        // react event 不是原生的，是 SyntheticEvent 组合的event
        // vue 是原生event 是MouseEvent
        event.preventDefault() // 阻止默认事件
        event.stopPropagation() // 阻止冒泡
    }
    render(){
        return <a href="http://www.baidu.com" onClick={this.onClick}>event</a>
    }
}
```

#### 传递自定义参数

```jsx
class CustomComponent extends React.Component {
    constructor(props){
        supper(props)
    }
    // 2. 静态方法，this指向当前实例
    onClick = (val,event) =>{
        // event对象在最后一个参数接受，前面参数为自定义传参
        console.log(val) // 'event'
    }
    render(){
        return <div  onClick={this.onClick('event')}>event</div>
    }
}
```

#### 写法：onClick onXxxx

### 表单

- 受控组件

```jsx
class CustomComponent extends React.Component {
    constructor(props){
        supper(props)
        this.state = {
            name: ''
        }
    }
    
    inputChange = (event) =>{
       this.setState({name: event.target.value})
    }
    render(){
        // 受控组件，这个组件受state控制，类似 vue 数据双向绑定，这里通过change事件自己实现数据绑定
        return <div>
            <p>{this.state.name}</p>
            <label htmlFor='inputName' >姓名：</label>
            <input id='inputName' value={this.state.name} onChange={this.inputChange} ></input>
        </div>
    }
}
```

- `input、textarea、select`用 `value`
- `checkbox、radio`用 `checked`
- `label` 标签 中的 `for` 用 `htmlFor`

### 组件

- props传递数据
- props类型检查
  - [类型校验工具 prop-types](https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html)
- props传递函数
- props默认值配置

```jsx
// props默认值配置
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// 指定 props 的默认值：
Greeting.defaultProps = {
  name: 'Stranger'
};

// 渲染出 "Hello, Stranger"：
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

### setState

- class组件才有state，函数组件没有state
- state要在constructor构造函数中定义
- **setState之前，不能直接修改state值**
- **setState赋值是一个全新的值，不能影响原始的state值**
- **不可变值原则**

```js {11,18}
// 不可变值（函数式编程，纯函数） - 数组
const list5Copy = this.state.list5.slice() // 创建副本
list5Copy.splice(2, 0, 'a') // 对创建副本中间插入/删除
this.setState({
    list1: this.state.list1.concat(100), // 追加
    list2: [...this.state.list2, 100], // 追加
    list3: this.state.list3.slice(0, 3), // 截取
    list4: this.state.list4.filter(item => item > 100), // 筛选
    list5: list5Copy // 其他操作
})
// 注意，不能直接对 this.state.list 进行 push pop splice 等，这样违反不可变值

// 不可变值 - 对象
this.setState({
    obj1: Object.assign({}, this.state.obj1, {a: 100}),
    obj2: {...this.state.obj2, a: 100}
})
// 注意，不能直接对 this.state.obj 进行属性设置，这样违反不可变值

```
- 可能是异步更新
  - 直接使用`setState`是异步的
  - 在`setTimeout`中`setState`是同步的
  - 在`自定义DOM事件`中`setState`是同步的
- 可能会被合并
  - 传入对象，会被合并
  - 传入函数，不会被合并
```js
// 传入对象，会被合并（类似Object.assign），执行结果只执行一次+1
this.setState({ count: this.state.count + 1 })
this.setState({ count: this.state.count + 1 })
this.setState({ count: this.state.count + 1 })

// 传入函数，不会被合并,执行3次+1
this.setState((preState,props)=>{
    return {
        count: preState.count + 1
    }
})
this.setState((preState,props)=>{
    return {
        count: preState.count + 1
    }
})
this.setState((preState,props)=>{
    return {
        count: preState.count + 1
    }
})
```

### 生命周期
![react 生命周期](/img/react生命周期.png)

- [组件生命周期图](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
- 父子组件生命周期和vue完全一样

vue和react生命周期对应

| vue           | react                 |
| ------------- | --------------------- |
| beforeCreate  | constructor           |
| mounted       | componentDidMount     |
| beforeUpdate  | shouldComponentUpdate |
| updated       | componentDidUpdate    |
| beforeDestroy | componentWillUnmount  |

### class组件与函数组件
- class组件
  - 有生命周期
  - 有state
  - 可扩展其他方法
- 函数组件
  - 纯函数，输入props，输出jsx
  - 没有实例，没有生命周期，没有state
  - 不能扩展其他方法
- 选择：只输入props输出jsx就用函数组件

### 非受控组件

- ref
  - vue ref 使用
  - react ref 使用
  
```html
<template>
    <!--定义ref-->
    <div ref='vueRef'>ref</div>
</template>
<script>
export default {
    mounted(){
        // 获取ref
        const vueRef = this.$refs.vueRef
    }
}
</script>
```
```jsx {7,11,17}
class App extend React.Component {
    constructor(props){
        super(props)
        this.state = {
            name: ''
        }
        this.inputRef = React.createRef() // 创建ref
    }
    render(){
        return <div>
            <input defaultValue={this.state.name} ref={this.inputRef} />
            <button onClick={this.onAlerName}>alerName</button>
        </div>
    }
    
    onAlerName = ()=>{
        const elem = this.inputRef.current // 通过 ref 获取 DOM 节点
        alert(elem.value) // 不是this.state.name
    }
}
```
- defaultValue、defaultChecked
- 手动操作DOM元素
- 不受state控制，只是拿state值赋个默认初始值，defaultValue、defaultChecked，input怎么变化和state没关系了
- 通过ref方式获取DOM节点信息
- 应用场景
  - **必须操作DOM，setState实现不了的**
  - `<input type='file' />`
  - 富文本编辑器，需要传入DOM元素

### 受控组件vs非受控组件

- 优先使用受控组件，符合React设计原则
- 必须操作DOM时，再用非受控组件

### Portals 传送门

- 组件默认会按既定层次嵌套渲染
- 如何让组件渲染到父组件以外？ 
- `this.props.children` 与`vue slot` 类似
- fixed 元素要放在 body 上，有更好的浏览器兼容性
- `ReactDOM.createPortal`
- 和 vue `vm.$mount()` 类似可以指定挂载点

```js {17-22}
import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        // // 正常渲染
        // return <div className="modal">
        //     {this.props.children} {/* vue slot */}
        // </div>

        // 使用 Portals 渲染到 body 上。
        // fixed 元素要放在 body 上，有更好的浏览器兼容性。
        return ReactDOM.createPortal(
            <div className="modal">{this.props.children}</div>,
            document.body // DOM 节点，指定挂载点
        )
    }
}

export default App
```
- 使用场景
  - css兼容性和布局的一些场景
  - overflow: hidden
  - 父组件z-index太小
  - fixed需要放在body第一层级
  
### context 上下文
  
- 公共信息（主题、语言）如何传递给每个组件？
- 用props太频繁
- 用redux小题大做
- 与vue 中 `provide / inject` 类似
- 核心api：`React.createContext`、`Provider/Consumer`、`contextType`
- 顶层父组件生成与管理数据、子组件消费数据
- 生产与管理数据

```jsx {3,14-18}
const React from "react"
// 1. 创建context填入默认值
const ThemeContext = React.createContext('light')

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            theme: 'light'
        }
    }
    render() {
        // 2. ThemeContext.Provider 组件包裹子组件，在该组件下所有的子组件都可以读取到context数据
        return <ThemeContext.Provider value={this.state.theme}>
            <Toolbar />
            <hr/>
            <button onClick={this.changeTheme}>change theme</button>
        </ThemeContext.Provider>
    }
    changeTheme = () => {
        this.setState({
            theme: this.state.theme === 'light' ? 'dark' : 'light'
        })
    }
}

export default App
```
- 子组件消费数据
  - class组件消费context数据,定义contextType，读取this.context
    ```jsx {13,3,6}
      class ThemedButton extends React.Component {
        // 指定 contextType 读取当前的 theme context。
        // static contextType = ThemeContext // 定义contextType方式2 es6语法 
        
        render() {
            const theme = this.context //  React 会往上找到最近的 theme Provider，然后使用它的值。
            return <div>
                <p>button's theme is {theme}</p>
            </div>
        }
    }
    
    ThemedButton.contextType = ThemeContext // 定义contextType方式1. 指定 contextType 读取当前的 theme context。
    ```
  - function组件消费context数据,`Consumer`
    ```jsx {6-8}
    // 底层组件 - 函数是组件
    function ThemeLink (props) {
        // const theme = this.context // 会报错。函数式组件没有实例，即没有 this
    
        // 函数式组件可以使用 Consumer
        return <ThemeContext.Consumer>
            { value => <p>link's theme is {value}</p> }
        </ThemeContext.Consumer>
    }
    ```

### 异步组件
  
- import()
- React.lazy
- React.Suspense
  
```jsx {3,13-15}
import React from 'react'

const ContextDemo = React.lazy(() => import('./ContextDemo'))

class App extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div>
            <p>引入一个动态组件</p>
            <hr />
            <React.Suspense fallback={<div>Loading...</div>}>
                <ContextDemo/>
            </React.Suspense>
        </div>
    
        // 1. 强制刷新，可看到 loading （看不到就限制一下 chrome 网速）
        // 2. 看 network 的 js 加载
    }
}

export default App
```

### 性能优化

- **shouldComponentUpdate**
  - react默认：父组件更新，子组件无条件也更新,有些组件无需重新渲染，可以通过 `shouldComponentUpdate` 进行操作是否重新渲染
  - 需要的时候才优化，如果不影响性能就不用太过在意细节
  - 不建议深度比较，推荐浅层比较
  - **必须配合state不可变值**
  - 如果在setState之前改变state的值，在进行setState，那么在shouldComponentUpdate生命周期中nextState和现在的state进行对比，就会是同个值，就无法正常判定是否改重新渲染
  - **state数据结构不要设计太深,与vue中data设计同理，进行深度计较（一次递归到底）的时候耗费性能**
  - lodash的isEqual 可以对对象或者数组进行深度比较（一次递归到底）
```js
// 默认值返回true
shouldComponentUpdate(nextProps,nextState){
    if(_.isEqual(nextState,this.state)){
      return false  // 不重复渲染
    }
    return true // 可以渲染
}
```
- `React.PureComponent`（纯组件）、`React.memo`
  - `React.PureComponent``，shouldComponentUpdate` 中实现了浅比较，只比较第一层数据，配合 **state不可变值原则**
  - 浅比较已使用大部分情况（尽量不要做深度比较）
  - memo ，函数组件中的 React.PureComponent
  ```js
  // React.PureComponent用法
  class List extends React.PureComponent {
      shouldComponentUpdate(){/* 做了浅比较 */}
  }
  
  // memo 用法
  function MyComponent(){
      // 使用props渲染
  }
  // 类似shouldComponentUpdate的一个函数
  function areEqual(prevProps,nextState){
      // 类似shouldComponentUpdate的比较，返回true重新渲染，返回false不重复渲染
  }
  
  export default React.memo(MyComponent,areEqual)
  ```
- 不可变值immutable.js
  - 彻底拥抱”不可变值“
  - 基于共享数据（不是深拷贝），速度好
  - 有一定的迁移和学习成本，按需使用

  ```js
  const map1 = Immutable.Map({a:1,b:2,c:3})
  const map2 = map1.set('b',50)
  
  map1.get('b') // 2
  map2.get('b') // 50
  ```
  
 ### 关于组件公共逻辑的抽离
 
 - mixin 被React废弃
 - 高阶组件HOC
   - 和js中的高阶函数一样
   - 保证扩展性，透传所有属性 `{...this.props}`

   ``` html
   <!--react-->
   <Component {...this.props} />
   <!--vue-->
   <Component v-bind="$props" />
   ```

   - 高阶组件不是一种功能，而是一种模式
   ```js
   const HOCFactory = (Component) => {
       class HOC extends React.Component {
           // 此处定义多个组件的公共逻辑
           render(){
                // 返回拼装结果，透传所有属性
               return <Component {...this.props} />
           }
       }
       
       return HOC
   }
   
   const EnhancedComponent1 = HOCFactory(WrappedComponent1)
   const EnhancedComponent2 = HOCFactory(WrappedComponent2)
   ```
   - redux connect 就是一个高阶组件
   ```js
   export const connect = (mapStateToProps,mapDispatchToProps)=> (WrappedComponent)=>{
       class Connect extends React.Component {
           constructor(){
               super()
               this.state = {
                   allProps: {}
               }
           }
           // 中间省略 n 段代码
           render(){
               return <WrappedComponent {...this.state.allProps} />
           }
       }
       return Connect
   }
   ```
   - vue中的高阶组件
   ```html
   <!--vue-->
   <Component v-bind="$attrs" v-on="$listeners"/>
   ```
 - **Render Props 推荐**
   - 公共逻辑组件，只提供封装逻辑，然后把处理后的state 通过参数传给render函数，怎么渲染通过父组件传入render函数属性进行渲染
   - 与HOC对比，不同的地方在于HOC是公共逻辑组件嵌套传入组件，而Render Props 是的公共逻辑组件不嵌套组件，只处理逻辑，接受父组件传入的render函数进行渲染内容
   - Render Props不是一种功能，而是一种模式

```jsx {21,33-36,27}
import React from 'react'
import PropTypes from 'prop-types'

class Mouse extends React.Component {
    constructor(props) {
        super(props)
        this.state = { x: 0, y: 0 }
    }
    
    handleMouseMove = (event) => {
        this.setState({
        x: event.clientX,
        y: event.clientY
        })
    }
    
    render() {
        return (
        <div style={{ height: '500px' }} onMouseMove={this.handleMouseMove}>
            {/* 将当前 state 作为 props ，传递给 render （render 是一个函数组件） */}
            {this.props.render(this.state)}
        </div>
        )
    }
}
Mouse.propTypes = {
    render: PropTypes.func.isRequired // 必须接收一个 render 属性，而且是函数
}

const App = (props) => (
    <div style={{ height: '500px' }}>
        <p>{props.a}</p>
        <Mouse render={
            /* render 是一个函数组件 */
            ({ x, y }) => <h1>The mouse position is ({x}, {y})</h1>
        }/>
        
    </div>
)

/**
 * 即，定义了 Mouse 组件，只有获取 x y 的能力。
    * 至于 Mouse 组件如何渲染，App 说了算，通过 render prop 的方式告诉 Mouse 。
    */

export default App
```
 - HOC vs Render Props
   - HOC：模式简单，当是会增加组件层级
   - Render Props：代码简洁，学习成本相对较高
   - 按需使用
   
### Redux 使用
   
- 基本概念
  - store state
  - action
  - reducer
- 单项数据流
  - dispatch(action)
  - reducer => newState 注意不可变值
  - subscribe 触发通知
- react-redux
  - `<Provider>`
  - connect
  - mapStateToProps、mapDispatchToProps
- 异步action
- 中间件
  - redux-thunk
  - redux-promise
  - redux-saga
```js
import { applyMiddleware, createStore } from 'redux'
import createLogger from "redux-logger"
import thunk from "redux-thunk"
const logger = createLogger()
const store = createStore(
    reducer,
    applyMiddleware(thunk,createLogger) // 会按顺序执行，对dispatch做改造
)
```

![流程图](/img/redux.jpg)

redux-logger
```js
// 自己修改dispatch，增加logger
const next = store.dispatch
store.dispatch = function(action){
    console.log('dispatching',action)
    next(action)
    console.log('next state',store.getState())
}
```

### react-router
- react-router-dom : useParams、Link、useHistory

```js
import {useParams,Link,useHistory} from "react-router-dom"


```

- 路由懒加载

```js
import { BrowserRouter as Router,Route,Switch } from "react-router-dom"
impirt React,{Suspense , lazy} from "react"

const Home = lazy(()=>import('./router/home'))
const About = lazy(()=>import('./router/about'))

const App = () =>{
    <Router>
        <Suspense fallback={<div>Loding...</div>}>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/about' component={About} />
            </Switch>
        </Suspense>
    </Router>
}
```

### 函数式编程

- 一种编程范式
- 纯函数
- **不可变值**

### jsx本质

- jsx等同于vue模板
- vue模板不是html
  - render函数（h函数）
  - 返回vnode
  - patch
- jsx也不是js
- [babel jsx在线编译工具](https://www.babeljs.cn/)
- `React.createElement` 即h函数，返回vnode
- 第一个参数可能是组件，也可能是html tag
- **组件名，首字母必须大写（React规定），以区分和 html tag 差异**

```js
React.createElement('div', null, [child1, child2, child3])
React.createElement('div', {...}, child1, child2, child3)
React.createElement(List, null, child1, child2, '文本节点')
// h 函数
// 返回 vnode
// patch
```
```js
// 第一个参数是List组件
React.createElement(List,{ list: list })

// 找到List组件jsx结构，继续拆分
React.createElement('ul',null,list.map(
    function(item,index){
       return  React.createElement('li',{
           key: item.id
       },'title',item.title)
    }
))
```
最终都是编译成 html tag 标签的 `React.createElement` `vnode` 数据结构

### 合成事件

- react17以前版本的所有事件都挂载到document上，react17挂载到root组件上
- event不是原生的，是个 `SyntheticEvent` 合成事件对象
- 和vue事件不同，和dom事件也不同
- 为什么用事件合成机制？
  - 更好兼容性和跨平台
  - 挂载到document上，减少内存消耗，避免频繁解绑
  - 方便事件的统一管理（事务机制）
![合成事件](/img/事件合成流程.png)
### setState 和 batchUpdate

- **有时是异步的（普通使用），有时是同步的（setTimeout、自定义DOM事件）**
- 有时是合并的（对象形式：Object.assign），有时不合并（函数形式）


- setState主流程
![setState主流程](/img/setState主流程.png)
- batchUpdate机制
- transaction（事务）机制
![transaction（事务）机制](/img/transaction事务机制.png)
```js
// transaction（事务）机制
class List extends React.Component {
    increase = ()=>{
        // 开始：处于batchUpdate
        // isBatchingUpdates = true 实际不是在函数中定义的
        
       // 其他操作
        
        // 结束
        // isBatchingUpdates = false
    }
}
```

setState是同步还是异步？
- setState本身无所谓异步还是同步
- 看是否命中batchUpdate机制
- 判断 isBatchingUpdates
```js
// setState普通用法

class List extends React.Component {
    increase = ()=>{
        // 开始：处于batchUpdate
        // isBatchingUpdates = true
        
        this.setState({
            count: this.state.count + 1
        })
        
        // 结束
        // isBatchingUpdates = false
    }
}

// setState放在setTimeout中

class List extends React.Component {
    increase = ()=>{
        // 开始：处于batchUpdate
        // isBatchingUpdates = true
        
        setTimeout(()=>{
          // 此时：isBatchingUpdates = false
          this.setState({
            count: this.state.count + 1
          })  
        },0)
        
        // 结束
        // isBatchingUpdates = false
    }
}

// 在自定义DOM事件中
class List extends React.Component {
    increase = ()=>{
        // 开始：处于batchUpdate
        // isBatchingUpdates = true
        
        document.addEventListener('clicl',()=>{
          // 此时：isBatchingUpdates = false
          this.setState({
            count: this.state.count + 1
          }) 
        })
    
        // 结束
        // isBatchingUpdates = false
    }
}
```

- 哪些可以命中batchUpdate机制
  - 生命周期（和它调用的函数）
  - React中注册的事件（和它调用的函数）
  - React可以“管理”的入口
  - ==能不能命中看入口，不是看函数==
- 哪些不能命中batchUpdate机制
  - setTimeout、setInterval等（和它调用的函数）
  - 自定义DOM事件（和它调用的函数）
  - React“管不到”的入口
  
### 组件渲染和更新过程
  
- jsx如何渲染成页面
- setState之后如何更新页面
- 面试考察全流程
- 组件渲染过程
    - props、state
    - render()生成vnode
    - patch(elem,vnode)
- 组件更新过程
    - setState(newState) => dirtyComponents（可能有子组件）
    - render()生成newVnode
    - patch(vnode,newVnode)
- 更新patch被拆分为两个阶段
    - `reconciliaction`阶段-执行diff算法，纯js计算
    - `commit`阶段-将diff结果渲染DOM
- 为什么拆分为两个阶段，可能会有问题问题
    - js是单线程，且和DOM渲染公用一个线程
    - 当组件足够复杂，组件更新时计算和渲染都压力大
    - 同时在有DOM操作需求（动画、鼠标拖拽操作扥），将卡顿
- 更新patch被拆解决方案 `React fiber`
    - 将`reconciliaction`阶段进行任务拆分（commit无法拆分）
    - DOM需要渲染的时候暂停js计算任务，空闲的时候恢复
    - `window.requestIdleCallback` 判断什么时候需要渲染

## webpack5

### 基本配置

- 拆分配置和merge
- 启动本地服务

### 抽离压缩css

- 用于生产环境
- mini-css-extract-plugin、terser-webpack-plugin、optimize-css-assets-webpack-plugin

```js
const { join } = require('path')
const { srcPath, distPath } = require('paths')
// css 抽离 插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩代码插件
const TerserJSPlugin = require('terser-webpack-plugin')
// 压缩css代码插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 清除 output.path 路径下内容
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: join(srcPath,'main.js'),
    output: {
        filename: 'bundle.[contenthash:8].js',
        path: distPath
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use:[
                    // 这里不是style-loader，抽离成单独css文件
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                    'postcss-loader'
                ]
            }
        ]
    },
    plugins:[
        // 默认清空 output.path 文件夹
        new CleanWebpackPlugin(),
        // 定义环境变量
        // window.ENV = 'production'
        new webpack.DefinePlugin({ ENV: JSON.stringify('production') }),
        // 抽离css
        new MiniCssExtractPlugin({
            filename: join(distPath,'css','main.[contenthash:8].css')
        })
    ],
    optimization: {
        // 压缩css
        minimizer: [new TerserJSPlugin({}), new OptimizeCssAssetsPlugin({})]
    }
    
}
```

### 代码 splitChunks

chunks产出地方

- entry
- splitChunks
- import()

```js
module.export = {
    optimization :{
        splitChunks: {
            /**
            *   initial 入口chunk，对于异步导入的文件不处理
            *   async 异步chunk，只对异步导入的文件处理
            *   all 全部chunk
            */
            chunks: 'all',
            // 缓存分组
            cacheGroups: {
                // 第三方库
                vendor:{
                    name: 'vendor', // chunks名称
                    priority: 1, // 优先级，权限更高的优先抽离，重要
                    test: /node_modules/, // 匹配路径
                    minSize: 0, // 最小打包限制
                    minChunks: 1 // 最少引用次数，第三方库引用一次就抽离
                },
                // 公用代码
                common:{
                    name: 'common',
                    priority: 0,
                    minSize: 1 * 1024, // 最小打包尺寸，如果太小的就没必要分模块增加http请求
                    minChunks: 2 // 至少引用2次
                },
            }
        }
    }
}
```

### 多页配置

- html-webpack-plugin
- 多个entry 入口配置，多个输出 HtmlWebpackPlugin plugin配置

```js
const { join } = require('path')
const { srcPath, distPath } = require('paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry:{
        index: join(srcPath,'index.js'), // 这个键名就是chunk名，index
        other: join(srcPath,'other.js')
    },
    plugins:[
        new HtmlWebpackPlugin({
            // html 模板
            template: join(srcPath,'index.html'),
            // 输出名称
            filename: 'index.html',
            // chunks配置该html文件引入哪些模块，默认全引入，
            // chunk来源：
            // 1. entry配置的chunk
            // 2. splitChunks配置的chunk，例如：vendor、common
            // 该配置表示只引入entry配置的index chunk
            chunks:['index']
        }),
        new HtmlWebpackPlugin({
            template: join(srcPath,'other.html'),
            filename: 'other.html',
            chunks:['other']
        }),
    ]
}
```

### DllPlugin 动态链接库配置

- DllPlugin 产出dll文件
- DllReferencePlugin 引用dll文件

1. 第一步先生成 dll.js 和 manifest.json

```js
// webpack.dll.js
const { join } = require('path')
const { distPath } = require('./paths')
const DllPlugin = require('webpack/lib/DllPlugin')

module.exports = {
    entry: {
        // 把 React 相关模块的放到一个单独的动态链接库
        react: ['react','react-dom']
    },
    output: {
        // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
        // 也就是 entry 中配置的 react 和 polyfill
        filename: '[name].dll.js',
        path: distPath,
        // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
        // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
        library: '_dll_[name]'
    },
    plugins:[
        new DllPlugin({
            // 动态链接库的全局变量名称，需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
            // 例如 react.manifest.json 中就有 "name": "_dll_react"
            name: '_dll_[name]',
            // 描述动态链接库的 manifest.json 文件输出时的文件名称
            path: join(distPath,'[name].manifest.json')
        })
    ]
}
```

2. development 环境中引用 manifest.json

```js
const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const webpackCommonConf = require('./webpack.common.js')
const { srcPath, distPath } = require('./paths')

// 第一，引入 DllReferencePlugin
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

module.exports = merge(webpackCommonConf, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: srcPath,
                exclude: /node_modules/ // 第二，不要再转换 node_modules 的代码
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            // window.ENV = 'production'
            ENV: JSON.stringify('development')
        }),
        // 第三，告诉 Webpack 使用了哪些动态链接库
        new DllReferencePlugin({
            // 描述 react 动态链接库的文件内容
            manifest: require(path.join(distPath, 'react.manifest.json')),
        }),
    ],
    devServer: {
        port: 8080,
        progress: true,  // 显示打包的进度条
        contentBase: distPath,  // 根目录
        open: true,  // 自动打开浏览器

        // 设置代理
        proxy: {
            // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
            '/api': 'http://localhost:3000',

            // 将本地 /api2/xxx 代理到 localhost:3000/xxx
            '/api2': {
                target: 'http://localhost:3000',
                pathRewrite: {
                    '/api2': ''
                }
            }
        }
    }
})

```

3. index.html模板中手动引入 webpack.dll.js

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
    <!--引入dll文件-->
    <script src="./react.dll.js"></script>
</body>
</html>
```
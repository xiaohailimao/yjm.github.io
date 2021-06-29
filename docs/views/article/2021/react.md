---
title: React
date: 2021-02-19
tags: 
- React
categories: 
- 文章
---

## React Hooks

- 可选功能（class组件 vs Hooks）
- 100%向后兼容，没有破坏性改动
- 不会取代class组件，尚未计划要移除class组件
### Hooks

- State Hook
  - 让函数组件实现state和setState
    - 默认函数组件没有state
    - 函数组件是一个纯函数，执行完即销毁，无法存储state
    - 需要 State Hook，即把state功能”钩“到纯函数中
  - useState
    - `useState(0)` 传入初始值，返回数组`[state,setState]`
    - 通过 `state` 获取值
    - 通过 `setState(1)` 修改值
    ``` JS
    import React, { useState } from 'react'

    function ClickCounter() {
        // 数组的解构
        // useState 就是一个 Hook “钩”，最基本的一个 Hook
        const [count, setCount] = useState(0) // 传入一个初始值

        const [name, setName] = useState('姓名')

        // const arr = useState(0)
        // const count = arr[0]
        // const setCount = arr[1]

        function clickHandler() {
            setCount(count + 1)
            setName(name + '2020')
        }

        return <div>
            <p>你点击了 {count} 次 {name}</p>
            <button onClick={clickHandler}>点击</button>
        </div>
    }

    export default ClickCounter
    ```
  
- Effect Hook
  - 让函数组件模拟生命周期
    - 默认函数组件没有生命周期
    - 函数组件是个纯函数，执行完即销毁，自己无法实现生命周期
    - 使用 Effect Hook 把生命周期”钩“到纯函数中
  - useEffect 让纯函数有了副作用
    - 默认情况下，执行纯函数，输入参数，返回结果，无副作用
    - 所谓的副作用，就是对函数之外造成影响，如设置全局定时任务
    - 而组件需要副作用，所以需要 useEffect ”钩“到纯函数中
  - useEffect
    - 模拟 `componentDidMount` - `useEffect` 依赖 `[]`
    - 模拟 `componentDidUpdate` - `useEffect` 无依赖，或者依赖 `[a,b]`
    
    ``` JS
    import React, { useState, useEffect } from 'react'

    function LifeCycles() {
        const [count, setCount] = useState(0)
        const [name, setName] = useState('姓名')

        // // 模拟 class 组件的 DidMount 和 DidUpdate
        // useEffect(() => {
        //     console.log('在此发送一个 ajax 请求')
        // })

        // // 模拟 class 组件的 DidMount
        // useEffect(() => {
        //     console.log('加载完了')
        // }, []) // 第二个参数是 [] （不依赖于任何 state）

        // // 模拟 class 组件的 DidUpdate
        // useEffect(() => {
        //     console.log('更新了')
        // }, [count, name]) // 第二个参数就是依赖的 state

        // 模拟 class 组件的 DidMount
        useEffect(() => {
            let timerId = window.setInterval(() => {
                console.log(Date.now())
            }, 1000)

            // 返回一个函数
            // 模拟 WillUnMount
            return () => {
                window.clearInterval(timerId)
            }
        }, [])

        function clickHandler() {
            setCount(count + 1)
            setName(name + '2020')
        }

        return <div>
            <p>你点击了 {count} 次 {name}</p>
            <button onClick={clickHandler}>点击</button>
        </div>
    }

    export default LifeCycles
    ```
    - 模拟 `componentWillUnmount`（不完全相等） - `useEffect` 中返回一个函数
      - `useEffect` 依赖 `[]`，组件销毁时执行fn（`useEffect` 中返回的函数），等于 `componentWillUnmount`
      - `useEffect` 无依赖或者依赖 `[a,b]`，组件更新时执行fn
      - 即，下一次执行 `useEffect` 之前，就会执行fn，无论更新或者卸载
    ``` JS
    import React, { useState, useEffect } from 'react'

    function FriendStatus({ friendId }) {
        const [status, setStatus] = useState(false)

        // DidMount 和 DidUpdate
        useEffect(() => {
            console.log(`开始监听 ${friendId} 在线状态`)

            // 【特别注意】
            // 此处并不完全等同于 WillUnMount
            // props 发生变化，即更新，也会执行结束监听
            // 准确的说：返回的函数，会在下一次 effect 执行之前，被执行
            return () => {
                console.log(`结束监听 ${friendId} 在线状态`)
            }
        })

        return <div>
            好友 {friendId} 在线状态：{status.toString()}
        </div>
    }

    export default FriendStatus
    ``` 
- useReducer 状态管理
- useReducer 和 redux 的区别
  - useReducer是useState的代替方案，用于state复杂变化
  - userReducer是单组件状态管理，组件通信还是要用props
  - redux是全局状态管理，多组件共享数据
- useMemo 缓存数据
  - React默认会更新所有子组件
  - class组件使用SCU和PureComponent做优化
  - Hook中使用useMemo，但是优化原理都是一样的，都是做了一层浅比较
- useCallback 缓存函数
- useRef 获取DOM元素
- useContext 
- Hook 常见优化策略
  - useMemo缓存数据
  - useCallback缓存函数
- 自定义 Hook
  - 封装通用的功能
  - 开发和使用第三方Hooks
  - 自定义Hook带来了无限的扩展性，解耦代码
  - 本质是个函数，以**use开头**（重要）
  - 内部正常使用useState、useEffect或者其他Hooks
  - 自定义返回结果，格式不限
- 组件逻辑复用
  - Mixins早已弃用
  - HOC
    - 组件层级嵌套过多，不易渲染，不易调试
    - HOC会劫持props，必须严格规范，容易出现疏漏
  - Render Prop
    - 学习成本高，不易理解
    - 只能传递纯函数，而默认情况下纯函数功能有限
  - Hooks
    - 自定义Hook
    - 完全符合Hooks原有规则，没有其他要求，易理解记忆
    - 变量作用域明确
    - 不会产生组件嵌套
- 规范和注意事项
  - 命名规范
    - 规定所有的Hooks都用`use开头`，例如 useXxx
    - 自定义Hook也要以`use开头`
    - 非Hooks的地方，尽量不要用 useXxx 写法
  - 使用规范
    - 只能用于**React函数组件**和**自定义Hook**中，其他地方不可以
    - **只能用于顶层代码，不能在循环、判断中使用Hooks**
      - 无论是render还是re-render，Hooks调用顺序比较保持一致
      - 如果Hooks出现在循环、判断里，无法保证调用顺序一致
      - **Hooks严重依赖调用顺序**
  - 注意事项
    - useState初始化值，只有第一次有效
    - useEffect内部不能修改state
      - 依赖（第二个参数）为空时 re-render 不会重新执行 effect 函数
      - 自定义变量解决问题（不推荐）
      - 使用useRef
    - useEffect可能出现死循环
      - 依赖（第二个参数）有引用类型数据就会出现死循环问题
      - 依赖使用 `Object.is` 判断是否改变，引用类型比较返回false，会导致重新执行useEffect导致死循环

### 问题

- 为什么会有 React Hooks，它解决了哪些问题？
  - 函数组件特点
    - 没有组件实例
    - 没有生命周期
    - 没有state和setState，只能接收props
  - class组件问题
    - 大型组件很难拆分和重构，很难测试（即class不易拆分）
    - 相同业务逻辑，分散到各个方法中，逻辑混乱
    - 复用逻辑变得复杂，如 Mixins、HOC、Render Prop
  - React组件更易用函数表达
    - React 提倡函数式编程
    - 函数更灵活，更易拆分，更易测试
    - 但函数组件太简单，需要功能增强--Hooks
- React Hooks 如何模拟组件生命周期？
- 如何自定义 Hook？
- React Hooks 性能优化
- 使用 React Hooks 遇到哪些坑？
- React Hooks 与 HOC 和 Render Prop 相比有哪些优点？

## 事件

### bind this

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

### 关于event事件

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

### 传递自定义参数

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

### 写法：onClick onXxxx

## 表单

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

## 组件

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

## setState

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

## 生命周期
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

## class组件与函数组件
- class组件
  - 有生命周期
  - 有state
  - 可扩展其他方法
- 函数组件
  - 纯函数，输入props，输出jsx
  - 没有实例，没有生命周期，没有state
  - 不能扩展其他方法
- 选择：只输入props输出jsx就用函数组件

## 非受控组件

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

## 受控组件vs非受控组件

- 优先使用受控组件，符合React设计原则
- 必须操作DOM时，再用非受控组件

## Portals 传送门

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
  
## context 上下文
  
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

## 异步组件
  
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

## 性能优化

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
  
 ## 关于组件公共逻辑的抽离
 
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
   
## Redux 使用
   
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

## react-router
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

## 函数式编程

- 一种编程范式
- 纯函数
- **不可变值**

## jsx本质

- createElement
- 执行返回vnode
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

- 样式名属性用 `className` 表示
- 富文本

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
## 合成事件

- react17以前版本的所有事件都挂载到document上，react17挂载到root组件上
- event不是原生的，是个 `SyntheticEvent` 合成事件对象
- 和vue事件不同，和dom事件也不同
- 为什么用事件合成机制？
  - 更好兼容性和跨平台
  - 挂载到document上，减少内存消耗，避免频繁解绑
  - 方便事件的统一管理（事务机制）
![合成事件](/img/事件合成流程.png)
## setState 和 batchUpdate

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
  
## 组件渲染和更新过程
  
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

## 组件通信

- 父子组件props
- 自定义事件
- Redux和Context


## Context是什么，如何应用

- 父组件向其所有子组件传递信息
- 如一些简单的公共信息：主题、语言等
- 复杂的公共信息用redux管理

## shouldComponentUpdate 用途

- 性能优化
- 配合”不可变值“使用，否则会出错

## redux单向数据流

## setState

```js
componentDidMount(){
    // state.count = 0
    this.setState({ count: this.state.count + 1 })
    console.log('1',this.state.count) // 0
    this.setState({ count: this.state.count + 1 })
    console.log('2',this.state.count) // 0
    setTimeout(()=>{
        this.setState({ count: this.state.count + 1 })
        console.log('3',this.state.count) // 2
    },0)
    setTimeout(()=>{
        this.setState({ count: this.state.count + 1 })
        console.log('4',this.state.count) // 3
    },0)
}
```

## 纯函数

- 返回一个新值，没有副作用（不会”偷偷“修改其他值）
- 重点：不可变值
- 如 arr1 = arr.slice()

## React 发起ajax应该放在哪个生命周期上

- 同vue mounted
- componentDidMount DOM渲染完的周期

## 渲染列表，为何用key

- 同vue，必须用key，且不能是index或者random
- diff算法中通过tag和key判断是不是sameNode
- 减少渲染次数，提高渲染性能

## 函数组件和class组件区别

- 纯函数，输入props输出jsx
- 没有实例，没有生命周期，没有state

## 什么是受控组件

- 表单的值，受state控制
- 需要自行监听onChange事件，更新state
- 对比非受控组件

## 何时使用异步组件

- 同vue
- 加载大组件
- 路由懒加载
- React.lazy，React.Suspence

## 多个组件有公共逻辑，如何抽离公共逻辑

-  高阶组件 HOC
-  Render Props
-  mixin已经被React废弃

## Redux 如何进行异步请求

- 使用异步action
- 如redux-thunk

## react-router 如何配置懒加载

## PureComponent有何区别

- 实现了比较浅的shouldComponentUpdate
- 性能优化
- 要结合不可变值使用

## React事件和DOM事件的区别

- 所有事件都挂载到document上，17版本后挂载到root组件上
- event不是原生的，是SyntheticEvent 合成事件对象
- dispatchEvent

## React性能优化

- 列表渲染使用key
- 自定义事件、DOM事件及时销毁
- 合理使用异步组件
- 减少函数 bind this 的次数
- 合理使用shouldComponentUpdate、PureComponent、memo
- 合理使用Immutable.js
- webpack层优化
- 前端通用性能优化，例如图片懒加载
- 使用SSR

## React和Vue的区别

- 都支持组件化
- 都支持数据驱动视图
- 都使用vdom操作DOM
- React使用jsx拥抱js，Vue使用模板拥抱html
- React是函数式编程，Vue是声明式编程
- React更多需要自力更生，Vue把想要的都给你

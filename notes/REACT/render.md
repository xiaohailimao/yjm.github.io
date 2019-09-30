# React 渲染
## 元素渲染

React元素是一个`不可变对象`，它代表某个特定时刻的UI，更新UI唯一的方式是创建一个全新的元素，并将其传入`ReactDOM.render(element, container[, callback])`中。

- ReactDOM.render() 会控制你传入容器节点里的内容。当`首次调用`时，容器节点里的`所有 DOM 元素都会被替换`，`后续的调用`则会使用 React 的 DOM 差分算法（DOM diffing algorithm）进行高效的`更新`。
- ReactDOM.render() 不会修改容器节点（只会修改容器的子节点）。可以在不覆盖现有子节点的情况下，将组件插入已有的 DOM 节点中。
- ReactDOM.render() 目前会返回对根组件 `ReactComponent` 实例的引用。 但是，目前应该避免使用返回的引用，因为它是历史遗留下来的内容，而且在未来版本的 React 中，组件渲染在某些情况下可能会是异步的。 如果你真的需要获得对根组件 `ReactComponent` 实例的引用，那么推荐为根元素添加 [callback ref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html)。

## 组件更新
1. 在 `React.Component` 的子类中有个必须定义的 `render()` 函数
2. 当组件的 `props` 或 `state` 发生变化时会触发更新

> - static getDerivedStateFormProps()
> - shouldComponentUpdate()
> - render()
> - getSnapshotBeforeUpdate()
> - componentDidUpdate()

### 可以在组件中调用的方法
```js
component.forceUpdate(callback)
```
调用 `forceUpdate()` 将致使组件调用 `render()` 方法，此操作会跳过该组件的 `shouldComponentUpdate()`。但其子组件会触发正常的生命周期方法，包括 `shouldComponentUpdate()` 方法。如果标记发生变化，React 仍将只更新 DOM
::: tip 
通常应该避免使用 `forceUpdate()`，尽量在 render() 只使用 `this.props` 和 `this.state`
:::

```js
setState(updater[, callback])
```
将 `setState()` 视为请求而不是立即更新组件的命令,`setState()` 并不总是立即更新组件。它会批量推迟更新。这使得在调用 `setState()` 后立即读取 `this.state` 成为了隐患。为了消除隐患，请使用 `componentDidUpdate` 或者 `setState` 的回调函数（setState(updater, callback)），这两种方式都可以保证在应用更新后触发。如需基于之前的 `state` 来设置当前的 `state，`

1. 第一个参数
- 对象形式（异步更改state）
这种形式的 setState() 是异步的，并且在同一周期内会对多个 setState 进行批处理（后调用setState的值会覆盖同一周期内先调用 setState 的值）。        
- 函数形式（同步更改state）
```js
(state, props) => stateChange
```
```js
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

2. 第二个参数：为可选的回调函数，它将在 setState 完成合并并重新渲染组件后执行。通常，建议使用 `componentDidUpdate()` 来代替此方式。

## Redux 更新

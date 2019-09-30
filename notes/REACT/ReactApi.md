# React api

## React.Component
是React组件的基类
## React.PureComponent
React.PureComponent 类似于 React.Component。它们的不同之处在于 React.PureComponent 实现了`shouldComponentUpdate()` 适用简单的属性和状态的组件，采用对属性和状态用浅比较的方式以提高性能。 但是 React.Component 没有实现。

::: warning 注意
React.PureComponent 的 shouldComponentUpdate() `只会对对象进行浅对比`。如果对象包含复杂的数据结构，它可能会因深层的数据不同而产生漏报判断。仅当你知道拥有的是简单的属性和状态时，才去继承 PureComponent，或者在你知道深层的数据结构已经发生改变时使用 forceUpate()。或者，考虑使用 不可变对象 来促进嵌套数据的快速比较。
此外,React.PureComponent 的 `shouldComponentUpdate() 会略过为整个组件的子树更新属性`。请确保所有的子级组件也是”纯”的。
:::

## React.createElement()
创建并返回给定类型的新 `React element` 。参数`type`既可以是一个标签名称字符串(例如`'div'`或 `'span'` )，也可以是一个 React component 类型(一个类或一个函数)，或者一个`React fragment` 类型。

```js
React.createElement(
  type,
  [props],
  [...children]
)
```

## React.cloneElement()
*克隆*并返回一个*新的React元素(React Element)*，使用 `element` 作为起点。生成的元素将会拥有`原始元素props`与`新props`的浅合并。新的子级会替换现有的子级。来自原始元素的 `key` 和 `ref` 将会保留。

```js
React.cloneElement(
  element,
  [props],
  [...children]
)
```

## isValidElement()
验证对象是否是一个React元素。返回 true 或 false 。
```js
React.isValidElement(object)
```

## React.Children

```js
React.Children.map(children, function[(thisArg)])
```
```js
React.Children.forEach(children, function[(thisArg)])
```
```js
React.Children.count(children)
```
```js
React.Children.only(children)
```
```js
React.Children.toArray(children)
```

## React.Fragment

React.Fragment 组件让你在一个render() 方法中返回多个元素，而不用创造一个额外的 DOM 元素：

```js
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

## React.createRef

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  render() {
    return <input type="text" ref={this.inputRef} />;
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }
}
```

## React.forwardRef

```js
function enhance(Component) {
  class Enhanced extends React.Component {
    // ...

    render() {
      const {forwardedRef, ...rest} = this.props;

      // Assign the custom prop "forwardedRef" as a ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Intercept the "ref" and pass it as a custom prop, e.g. "forwardedRef"
  function enhanceForwardRef(props, ref) {
    return <Enhanced {...props} forwardedRef={ref} />;
  }

  // These next lines are not necessary,
  // But they do give the component a better display name in DevTools,
  // e.g. "ForwardRef(withTheme(MyComponent))"
  const name = Component.displayName || Component.name;
  enhanceForwardRef.displayName = `enhance(${name})`;

  return React.forwardRef(enhanceForwardRef);
}
```

## 合成事件

你的事件处理器将会接收`SyntheticEvent`的实例，一个基于浏览器原生事件的跨浏览器实现。它拥有和浏览器原生事件一样的接口
```js{7,8,10}
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```
::: warning 注意
从事件处理器返回false将不再阻止事件传播，代替，应该手动触发`e.stopPropagation()`和`e.preventDefault()`。
:::

## DOM Elements
React实现了一套和浏览器无关的DOM系统，兼顾了性能和浏览器兼容问题。  
在React中，所有的`DOM特性`和`属性`（包括`事件处理函数`）都应该是`小驼峰命名法`命名。*aria-* 和 *data-* 属性是例外的

React DOM 属性
- checked   
checked属性受类型为checkbox或radio的`<input>`组件的支持，与之相对defaultChecked这是非受控组件的属性，用来设定对应组件首次装载时是否选中状态
- className     
使用className属性指定一个CSS类。
- dangerouselySetInnerHTML  
dangerouslySetInnerHTML是React提供的替换浏览器DOM中的innerHTML接口的一个函数
- htmlFor
- onChange
- selected  
selected属性被`<option>`组件支持
- style     
style属性接受一个`JavaScript对象`，其属性用`小驼峰命名法`命名，而不是接受CSS字符串。这和DOM中style JavaScript 属性是一致性的，是更高效的，而且能够防止XSS的安全漏洞。
默认单位px。        

注意样式不会自动补齐前缀。为了支持旧的浏览器，你需要手动提供相关的样式属性：
```jsx
const divStyle = {
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}

```
供应商前缀除了ms，都应该以大写字母开头。这就是为什么WebkitTransition有一个大写字母W。
- suppressContentEditableWarning
- value
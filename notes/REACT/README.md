

# React 开发笔记
## React 组合组件
### 场景
需要关联的成对组件，父组件想要传递一些信息给子组件，但是不想用props传递。
- 思路

通过 `React.cloneElement` 拷贝一份children，对拷贝children进行相应的属性添加操作，并渲染这份拷贝的children
### 用到api
- React.Children.map
- React.cloneElement
### 示例
tab切换组件

```js
// TabItem.jsx
const TabItem = (props) => {
    const { active, onClick } = props
    const tabStyle = {
        'max-width': '150px',
        color: active? 'red': 'green',
        border: active? '1px solid red' : '0px'
    }
    return (
        <h1 style={ tabStyle } onClick={onClick}>
            {props.children}
        </h1>
    )
}
```
```js{11,12,13}
// tab.jsx

class Tabs extends React.Component {
    state = {
        activeIndex: 0
    }

    render(){
        const newChildren = React.Children.map(this.props.children,(child,index)=>{
            if(child.type){
                return React.cloneElement(child,{
                    active: this.state.activeIndex === index,
                    onClick: ()=> this.setState({activeIndex: index})
                })
            }else{
                return child
            }
        })
        return (
            <Fragment>
                { newChildren }
            </Fragment>
        )
    }
}
```
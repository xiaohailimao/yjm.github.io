---
title: 基于Vuex的数据转换方案
date: 2021-04-25
tags: 
- vue
categories: 
- 文章
---

## 需求分析

在业务开发中常常会有 `Form` 表单的`录入`和`展示`， `Select` 选择项以及 `Table` 数据展示都有使用字典表数据

例如: 性别、民族等都是通过编码保存数据

``` JS
const sex = [ 
  { label: '男', value: '0' },
  { label: '女', value: '1' },
  { label: '未知', value: '2' },
]
```

在后台管理系统的业务中有大量表单和表格，需要做大量的编码转换工作，每个页面手动获取字典数据并控制渲染逻辑。<br/>
如果 `Select` 、 `Table`组件能只通过配置字典类型 `dict-type="sex"` 就完成字典数据的转换工作，那样将极大节省开发时间。

``` html {2}
<template>
  <el-select v-model="select" dict-type="sex" />
</template>
<script>
export default {
  data() {
    return {
      select: ""
    }
  },
}
</script>
```

## 方案设计

### 主流程核心问题：

1. 数据怎么获取？
2. 得到数据后怎么更新界面？

### 方案选取

1. 字典数据多个组件共享，数据统一管理
2. 
3. `Vue` 响应式数据可以被监听，数据变动后会自动刷新页面

基于这些点，使用 `Vuex` 进行数据管理刚好能够满足需求

## 代码实现

### 主流程核心代码

Vuex 获取数据
``` JS
const state = {
  data: {} // 字典数据对象
}

const mutations = {
  // 修改 data 值
  SET_DATA(state, payload) {
    state.data = { ...state.data, ...payload }
  }
}

const actions = {
  getData({ commit }, type) {
    // 调用获取字典数据请求接口方法
    getDictDataApi({ type })
      .then(res => {
        // 得到字典数据，提交commit
        commit('SET_DATA', res)
      })
      .catch(err => {
        console.log(err);
      })
  }
}

export default {
  namespance: true,
  state,
  mutations,
  actions,
}
```

#### Select 选择框组件

传入 `dictType` 属性获取对应字典数据，并在渲染字典数据

```js {15-18,21,28,11}
export default {
  props:{
    // 字典类型
    dictType:{
      type: String,
      required: true
    }
  },
  compouted:{
    dictData(){
      return this.$store.state.data
    }
  },
  mounted(){
    // 组件初始化，如果没有字典数据，就去请求字典数据
    if(!this.dictData[this.dictType]){
      this.$store.dispatch('getData',this.dictType)
    }
  },
  render(){
    const options = this.dictData[this.dictType] || [] // 传入类型为this.dictType的字典数据
    // 参数穿透
    const props = {
      attrs: this.$attrs,
      on: this.$listeners
    }

    return (<Select {...props} >
      {options.map(item => <Option :label="item.label" :value="item.value" />)}
    </Select>)
  }
}
```

#### Table 表格组件

传入 `dictType` 属性获取对应字典数据，并在渲染字典数据

```js {1,15-20,30}
// 引入通过编码值获取标签名方法
import { getLabelByValue } from "utils"

export default {
  props:{
    // 字典类型
    dictType:{
      type: String,
      required: true
    },
    // 显示文本
    text: [String|Number]
  },
  filters:{
    t(val,type){
      if(val){
        return  getLabelByValue(this.dictType,val)
      }

      return val
    }
  },
  render(){
    // 参数穿透
    const props = {
      attrs: this.$attrs,
      on: this.$listeners
    }
    // 表格中列子组件
    return (<Column {...props} >
      { this.text | t }
    </Column>)
  }
}
```
### 字典数据格式定义
接口返回数据示例
``` JS
{
  code: 0,
  data: {
    sex:[ 
      { label: '男', value: '0' },
      { label: '女', value: '1' },
      { label: '未知', value: '2' },
    ]
  }
}
```

### 功能点

#### 按需加载

1. 组件配置了字典属性
```html
<template>
  <Select dict-type="sex" />
</template>
```
2. 调用了获取字典的工具方法
``` JS
getLabelByValue('sex','0') // 男
```

当遇到上面两种情况时，会**先去读取缓存**中的数据，如果不存在**再请求接口数据**

``` JS {15-20}
import isEmpty from "lodash/isEmpty"

/**
 * 读取缓存数据
 * @param {Object} type 字典类型
 * @param {String} mode 本地缓存模式
 */
function getCacheData(type,mode = 'localStorage') {
  const d = JSON.pares(window[mode].getItem('__dictData__') || `{}`)
  return d[type]
}

const actions = {
  getData({ commit }, type) {
    // 读取本地缓存数据
    const cache = getCacheData(type, state.mode)
    // 如果有缓存数据返回缓存数据
    if(!isEmpty(cache)){
      // 得到字典数据，提交commit
      commit('SET_DATA', cache)
    }else {
      // 调用获取字典数据请求接口方法
      getDictDataApi({ type })
        .then(res => {
          // 得到字典数据，提交commit
          commit('SET_DATA', res)
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
}
```

#### 预加载

vue单文件组件字典数据预加载，当前组件中如果有较大的字典数据可以使用预加载提前加载数据，加快页面渲染速度
``` JS
export default {
  created(){
    // 预加载字典为sex类型的数据
    this.$store.dispatch('getData','sex')
  }
}
```

全局字典数据预加载
``` JS
// main.js 入口文件
import store from "./store"

const preloads = ['sex','nation'] // 预加载字典类型数据

preloads.forEach(type=>{
  store.dispatch('getData',type)
})
```

#### 数据缓存

存在 Vuex 中的数据页面刷新会被清空，所以需要存入本地缓存中防止页面刷新数据丢失

本地缓存可选择 `localStorage` 或者 `sessionStorage`

缓存处理代码
``` JS {24}
// dictionary.js
// ....
import merge from "lodash/merge"

/**
 * 把数据缓存到本地中
 * @param {Object} data 字典数据
 * @param {String} mode 本地缓存模式
 */
function cacheData(data,mode = 'localStorage') {
  const d = JSON.pares(window[mode].getItem('__dictData__') || `{}`) 
  window[mode].setItem('__dictData__',JSON.stringify(merge(d,data)))
}

const state = {
  mode: 'localStorage', // 本地缓存模式
  data: {} // 字典数据对象
}

const mutations = {
  // 修改 data 值
  SET_DATA(state, payload) {
    state.data = { ...state.data, ...payload }
    cacheData(state.data,state.mode)
  }
}

// ....
```

#### 数据格式化
后端返回数据格式不一定可能，这时就需要对数据进行格式化转换为可用数据
``` JS
// dictionary.js

function format(data) {
  // 数据格式化逻辑代码...
}

const state = {
  format: null, // 格式化方法
  data: {} // 字典数据对象
}

const actions = {
  getData({ commit }, type) {
    // 调用获取字典数据请求接口方法
    getDictDataApi({ type })
      .then(res => {
        // 如果配置了格式化方法，就将数据进行格式化
        if(state.format){
          res = state.format(res)
        }
        // 得到字典数据，提交commit
        commit('SET_DATA', res)
      })
      .catch(err => {
        console.log(err);
      })
  }
}
```

#### 通过标签名获取编码值工具方法

该方法可以获取编码值，适用于非选择框的展示数据编码转换

``` JS
// utils.js
import store from "@/store" // 引入 store/index 文件

/**
 * 读取缓存数据
 * @param {Object} type 字典类型
 * @param {String} mode 本地缓存模式
 */
function getCacheData(type,mode = 'localStorage') {
  const local = JSON.pares(window[mode].getItem('__dictData__') || `{}`)
  return store.state.dictionary.data[type] || local[type] // 先获取store缓存的数据，如果store中没有在去本地缓存查找
}

/**
 * 通过标签名获取编码值工具方法
 * @param {String} type 字典类型
 * @param {String} text 目标文本
 */
function async getValueByLabel(type,text){

  let data = getCacheData(type,store.state.dictionary.mode) // 获取数据

  if(isEmpty(data)){
   data = await store.dispatch('dictionary/getData',type)
  }else {
    if(Array.isArray(data)){
      for(let i = 0; i < data.length; i++){
        if(data[i].label === text){
          return data[i].value
        }
      }
    }
  }


  return text
}
```


#### 通过编码值获取标签名工具方法

该方法可以获取标签值，适用于非选择框的展示数据编码转换

``` JS
// utils.js
import store from "@/store" // 引入 store/index 文件

/**
 * 读取缓存数据
 * @param {Object} type 字典类型
 * @param {String} mode 本地缓存模式
 */
function getCacheData(type,mode = 'localStorage') {
  const local = JSON.pares(window[mode].getItem('__dictData__') || `{}`)
  return store.state.dictionary.data[type] || local[type] // 先获取store缓存的数据，如果store中没有在去本地缓存查找
}

/**
 * 通过标签名获取编码值工具方法
 * @param {String} type 字典类型
 * @param {String} text 目标文本
 */
function async getLabelByValue (type,text){

  let data = getCacheData(type,store.state.dictionary.mode) // 获取数据
  
  if(isEmpty(data)){
   data = await store.dispatch('dictionary/getData',type)
  }else {
    if(Array.isArray(data)){
      for(let i = 0; i < data.length; i++){
        if(data[i].value === text){
          return data[i].label
        }
      }
    }
  }


  return text
}
```

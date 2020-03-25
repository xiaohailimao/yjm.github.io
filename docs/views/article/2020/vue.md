---
title: vue笔记
date: 2020-03-16
tags:
 - vue
categories:
 -  文章
---


## 事件处理
[开发文档](https://cn.vuejs.org/v2/guide/events.html)
#### 事件修饰符

```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即元素自身触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

```
::: warning 注意：
使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击。
:::


访问原始的 DOM 事件。可以用特殊变量 $event 把它传入方法：

```html
<button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```
```js
methods: {
  warn: function (message, event) {
    // 现在我们可以访问原生事件对象
    if (event) event.preventDefault()
    alert(message)
  }
}
```
#### 按键修饰符
<p>全部的按键别名：</p>
<ul>
<li><code>.enter</code></li>
<li><code>.tab</code></li>
<li><code>.delete</code> (捕获“删除”和“退格”键)</li>
<li><code>.esc</code></li>
<li><code>.space</code></li>
<li><code>.up</code></li>
<li><code>.down</code></li>
<li><code>.left</code></li>
<li><code>.right</code></li>
</ul>

<h4 >自动匹配按键修饰符</h4>
<p>你也可直接将 <a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values" target="_blank" rel="noopener"><code>KeyboardEvent.key</code></a> 暴露的任意有效按键名转换为 kebab-case 来作为修饰符：</p>

```html
<input @keyup.page-down="onPageDown">
```
::: warning 注意：
有一些按键 (.esc 以及所有的方向键) 在 IE9 中有不同的 key 值, 如果你想支持 IE9，它们的内置别名应该是首选。
:::


## vue data恢复初始化

```js
Object.assign(this.$data, this.$options.data());
```


## provide/inject 组件通信依赖注入 

 [provide / inject API](https://cn.vuejs.org/v2/api/#provide-inject)主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。然后有两种场景它不能很好的解决（通过 `$on/$emit` 解决）：
- 父组件向子组件（支持跨级）传递数据
- 子组件向父组件（支持跨级）传递数据

使用
```js
// A.vue
export default {
  provide: {
    name: 'demo'
  }
}

// B.vue
export default {
  inject: ['name'],
  mounted () {
    console.log(this.name);  // demo
  }
}
```

小项目中代替vuex,减少依赖
app.vue
```html
<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
  import mixins_user from '../mixins/user.js';

  export default {
    mixins: [mixins_user],
    provide () {
      return {
        app: this
      }
    },
    data () {
      return {

      }
    }
  }
</script>
```
user.js
```js
export default {
  data () {
    return {
      userInfo: null
    }
  },
  methods: {
    getUserInfo () {
      // 这里通过 ajax 获取用户信息后，赋值给 this.userInfo，以下为伪代码
      $.ajax('/user/info', (data) => {
        this.userInfo = data;
      });
    }
  },
  mounted () {
    this.getUserInfo();
  }
}
```
引用页面
```html
<template>
  <div>
    {{ app.userInfo }}
  </div>
</template>
<script>
  export default {
    inject: ['app'],
    methods: {
      changeUserInfo () {
        // 这里修改完用户数据后，通知 app.vue 更新，以下为伪代码
        $.ajax('/user/update', () => {
          // 直接通过 this.app 就可以调用 app.vue 里的方法
          this.app.getUserInfo();
        })
      }
    }
  }
</script>
```
::: tip
使用 Vuex，最主要的目的是跨组件通信、全局数据维护、多人协同开发。需求比如有：用户的登录信息维护、通知信息维护等全局的状态和数据。
:::

::: warning 注意
provide 和 inject 绑定并`不是可响应的`。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。
:::

## axios 监听上传进度

```js
static post(url, params, config, onUploadCallback) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, qs.stringify(params), {
          ...config,
          onUploadProgress: function(progressEvent) {
            if (progressEvent.lengthComputable) {
              //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
              //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
              // callback1(progressEvent);
              onUploadCallback && onUploadCallback(progressEvent);
            }
          }
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
```



## vue 组件属性双向绑定
1. 自定义v-model  

允许一个自定义组件在使用 v-model 时定制 prop 和 event。默认情况下，一个组件上的 v-model 会把 value 用作 prop 且把 input 用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突。

```js
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    // this allows using the `value` prop for a different purpose
    value: String,
    // use `checked` as the prop which take the place of `value`
    checked: {
      type: Number,
      default: 0
    }
  },
  // ...
})
```

```html
<my-checkbox v-model="foo" value="some value"></my-checkbox>
```

上述代码相当于：
```html
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
```

2. 自定义事件修饰符.async
在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以修改父组件，且在父组件和子组件都没有明显的改动来源。

这也是为什么我们推荐以 `update:myPropName` 的模式触发事件取而代之。举个例子，在一个包含 title prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：

```js
this.$emit('update:title', newTitle)
```

然后父组件可以监听那个事件并根据需要更新一个本地的数据属性。例如：

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

为了方便起见，我们为这种模式提供一个缩写，即 .sync 修饰符：

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```
::: warning 注意
注意带有 `.sync` 修饰符的 `v-bind` `不能`和表达式一起使用 (例如 `v-bind:title.sync=”doc.title + ‘!’”` 是无效的)。取而代之的是，你只能提供你想要绑定的属性名，类似 `v-model`。
:::

当我们用一个对象同时设置多个 prop 的时候，也可以将这个 .sync 修饰符和 v-bind 配合使用：

```html
<text-document v-bind.sync="doc"></text-document>
```
这样会把 doc 对象中的每一个属性 (如 title) 都作为一个独立的 prop 传进去，然后各自添加用于更新的 v-on 监听器。

::: warning 注意
将 `v-bind.sync` 用在一个字面量的对象上，例如 `v-bind.sync=”{ title: doc.title }”`，是无法正常工作的，因为在解析一个像这样的复杂表达式的时候，有很多边缘情况需要考虑。
:::


## 深入响应式原理

### 追踪变化（响应监听）

当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的属性，并使用 `Object.defineProperty` 把这些属性全部转为 `getter/setter`。  
Object.defineProperty是es5无法shim的特性，所以vue不支持IE8及以下设备。   
每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据属性记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

![响应式](/img/img-vue-0.png)

### 检测变化的注意事项
- 受js限制，vue**无法检测到对象属性的添加或删除**。   
- 由于 Vue 会在初始化实例时对属性执行 getter/setter 转化，所以属性必须在 `data` 对象上存在才能让 Vue 将它转换为响应式的   
- Vue 不允许动态添加根级别的响应式属性  
- 可以使用 Vue.set(object, key, value) 方法向嵌套对象添加响应式属性
- 为已有对象赋值多个新属性
```js
// 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```
### 声明响应式属性
由于 Vue 不允许动态添加根级响应式属性，所以你必须在初始化实例前声明所有根级响应式属性，哪怕只是一个空值。
这样的限制在背后是有其技术原因的，它消除了在依赖项跟踪系统中的一类边界情况，也使 Vue 实例能更好地配合类型检查系统工作。
### 异步更新队列
Vue 在更新 DOM 时是**异步**执行的,只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 `watcher` 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的    

为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用 `Vue.nextTick(callback)`。  

在组件内使用 `vm.$nextTick()` 实例方法特别方便，因为它不需要全局 Vue，并且回调函数中的 this 将自动绑定到当前的 Vue 实例上：
```js
methods: {
  updateMessage: async function () {
    this.message = '已更新'
    console.log(this.$el.textContent) // => '未更新'
    await this.$nextTick()
    console.log(this.$el.textContent) // => '已更新'
  }
}
```
## VUE-CLI 环境变量和模式
[文档说明](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)

你可以替换你的项目根目录中的下列文件来指定环境变量：
```sh
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```
一个环境文件只包含环境变量的“键=值”对：
```
FOO=bar
VUE_APP_SECRET=secret
```
被载入的变量将会对 vue-cli-service 的所有命令、插件和依赖可用。

::: tip 环境加载属性
为一个特定模式准备的环境文件的 (例如 `.env.production`) 将会比一般的环境文件 (例如 `.env`) 拥有更高的优先级。
此外，Vue CLI 启动时已经存在的环境变量拥有最高优先级，并不会被 .env 文件覆写。
:::

::: warning NODE_ENV
如果在环境中有默认的 `NODE_ENV`，你应该移除它或在运行 `vue-cli-service` 命令的时候明确地设置 NODE_ENV。
:::

### 模式
**模式**是 Vue CLI 项目中一个重要的概念。默认情况下，一个 Vue CLI 项目有三个模式：
- `development` 模式用于 `vue-cli-service serve`
- `production` 模式用于 `vue-cli-service build` 和 `vue-cli-service test:e2e`
- `test` 模式用于 `vue-cli-service test:unit`

注意模式不同于 `NODE_ENV`，一个模式可以包含多个环境变量。也就是说，每个模式都会将 `NODE_ENV` 的值设置为模式的名称——比如在 `development` 模式下 `NODE_ENV` 的值会被设置为 `"development"`。  

你可以通过为 `.env` 文件增加后缀来设置某个模式下特有的环境变量。比如，如果你在项目根目录创建一个名为 `.env.development` 的文件，那么在这个文件里声明过的变量就只会在 development 模式下被载入。

你可以通过传递 `--mode` 选项参数为命令行覆写默认的模式。例如，如果你想要在构建命令中使用开发环境变量，请在你的 `package.json` 脚本中加入：
```
"dev-build": "vue-cli-service build --mode development",
```


## 渲染优化 v-cloak
这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 `[v-cloak] { display: none }` 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。

```css
[v-cloak] {
  display: none !important;
}
```
```html
<div v-cloak>
  {{ message }}
</div>
```

## render 函数使用场景

1.使用两个相同 slot。在 template 中，Vue.js 不允许使用两个相同的 slot，比如下面的示例是错误的：
```html
<template>
  <div>
    <slot></slot>
    <slot></slot>
  </div>
</template>
```
解决方案是使用一个深度克隆 VNode 节点的方法   
2.在 SSR 环境（服务端渲染），如果不是常规的 template 写法，比如通过 Vue.extend 和 new Vue 构造来生成的组件实例，是编译不过的    
3.在 runtime 版本的 Vue.js 中，如果使用 Vue.extend 手动构造一个实例，使用 template 选项是会报错的   
4.一个 Vue.js 组件，有一部分内容需要从父级传递来显示，如果是文本之类的，直接通过 props 就可以，如果这个内容带有样式或复杂一点的 html 结构，可以使用 v-html 指令来渲染，父级传递的仍然是一个 HTML Element 字符串，不过它仅仅是能解析正常的 html 节点且有 XSS 风险。当需要最大化程度自定义显示内容时，就需要 Render 函数，它可以渲染一个完整的 Vue.js 组件。你可能会说，用 slot 不就好了？的确，slot 的作用就是做内容分发的，但在一些特殊组件中，可能 slot 也不行。比如一个表格组件



## 过滤url中不需要的参数

```js
location.search.replace(/([?&])(code|clear)=\w+/gi, "")
```

## 修改微信标题

```js
export default function(title) {
  document.title = title;
  var mobile = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(mobile)) {
    var iframe = document.createElement("iframe");
    // iframe.style.visibility = "hidden";
    iframe.style.height = 0;
    iframe.style.width = 0;
    iframe.style.border = "none";
    iframe.setAttribute("src", "");
    document.body.appendChild(iframe);
    var timer = setTimeout(function() {
      document.body.removeChild(iframe);
      clearTimeout(timer);
      timer = null;
    }, 300);
  }
}
```

## npm包安装问题

可能原因：
1.缓存  
2.加载不全  
3.版本变更依赖改变  

解决方案（逐个检验）：    
1.npm cache clear --force   
2.如果cnpm安装失败，可能原因是相关局部npm包更新，cnpm没有全部更新，导致关系错乱。采用npm安装  
3.重启电脑，采用npm安装   

## 微信SDK使用

```js
var wx = require("weixin-js-sdk");

import axios from "axios";

import { URL_HREF_WX_SERVER } from "../assets/config/baseUrl";

import { Toast } from "vant";

import Api from "../api/api";

// 微信SDK签名配置
function signature({ debug = false, appId, timestamp, nonceStr, signature }) {
  wx.config({
    debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId, // 必填，公众号的唯一标识
    timestamp, // 必填，生成签名的时间戳
    nonceStr, // 必填，生成签名的随机串
    signature, // 必填，签名
    jsApiList: [
      "onMenuShareAppMessage",
      "onMenuShareTimeline",
      "onMenuShareQQ",
      "onMenuShareWeibo",
      "onMenuShareQZone",
      "chooseWXPay",
      "updateAppMessageShareData",
      "updateTimelineShareData"
    ] // 必填，需要使用的JS接口列表
  });
}

// 签名配置
export function wechatConfig() {
  let params = {
    url: location.href.split("#")[0]
  };

  return new Promise((resolve, reject) => {
    axios
      .get(URL_HREF_WX_SERVER, { params })
      .then(res => {
        let data;
        if (res.status == "200") {
          data = res.data.data;
          signature({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature
          });
          wx.ready(function() {
            resolve(data);
          });
          wx.error(function(err) {
            console.log(err);
            Toast(err.errMsg);
            reject(err);
          });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 微信信分享
 * @param {String} title 标题
 * @param {String} link 跳转链接
 * @param {String} imgUrl 图标地址
 * @param {String} desc 描述信息
 * @param {String} success 分享成功回调函数
 * @param {String} fail 分享失败回调函数
 * @param {String} cancel 分享取消回调函数
 */
export function wxShare({ title, link, imgUrl, desc, success, fail, cancel }) {
  wx.onMenuShareTimeline({
    title, // 分享标题
    desc,
    link: encodeURI(link), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success,
    fail,
    cancel
  });
  wx.onMenuShareAppMessage({
    title, // 分享标题
    desc,
    link: encodeURI(link), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success,
    fail,
    cancel
  });
  wx.onMenuShareQQ({
    title, // 分享标题
    desc,
    link: encodeURI(link), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success,
    fail,
    cancel
  });
  wx.onMenuShareWeibo({
    title, // 分享标题
    desc,
    link: encodeURI(link), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success,
    fail,
    cancel
  });
  wx.onMenuShareQZone({
    title, // 分享标题
    desc,
    link: encodeURI(link), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success,
    fail,
    cancel
  });
}

/**
 * 分享参数配置
 */
function shareConfig() {
  let shareId = `${new Date().getTime()}${Math.floor(Math.random() * 1000)}`;
  return {
    shareId,
    imgUrl:"",
    desc: "描述文字",
    title: document.title,
    link: `${location.origin + location.pathname}?shareCode=${shareId}`,
    alias: {
      onMenuShareTimeline: "分享朋友圈",
      onMenuShareAppMessage: "分享好友",
      onMenuShareQQ: "分享QQ",
      onMenuShareWeibo: "分享微博",
      onMenuShareQZone: "分享QQ空间"
    }
  };
}
/**
 * 分享统计
 * @param {String} mode 分享方式
 * @param {String} shareId 分享id
 */
function shareStatistics(mode, shareId) {
  Api.share({
    shareTime: new Date().getTime(),
    shareId,
    mode,
    productId: ""
  });
}

function init() {
  wechatConfig().then(() => {
    let params = shareConfig();
    wxShare({
      title: params.title,
      link: params.link,
      imgUrl: params.imgUrl,
      desc: params.desc,
      success: function(val) {
        shareStatistics(
          params.alias[val.errMsg.split(":")[0]],
          this.link.split("?shareCode=")[1]
        );
        init();
      }
    });
  });
}
init();

```


## 重载页面

```js
location.reload(isfouce)//true强制刷新获取新数据，false会取缓存中的值
```
## 遮罩层限制背景滚动

当遮罩层显示时控制body，固定body，当隐藏遮罩层的时候取消对body的控制

```js
let bodyElement = document.body;
let top = 0;

function stopBodyScroll (isFixed) {
  if (isFixed) {
    top = window.scrollY
    bodyElement.style.position = 'fixed'
    bodyElement.style.top = -top + 'px'
  } else {
    bodyElement.style.position = ''
    bodyElement.style.top = ''
    window.scrollTo(0, top) // 回到原先的top
  }
}

```


## 监听storage事件

```js
//  同域名下非当前页的localStorage/sessionStorage数据改变都会触发storage事件
// 用户跨项目通信（例如用户信息数据刷新等）
window.addEventListener("storage",function(e){},false)
```

## 历史管理

```js
//*.vue
//控制回退地址
//适用多项目跳转，指定返回路径
//使用场景：forward a=>b=>c,back c=>a,跳过b
 methods: {
    //回退地址
    callback() {
      location.href = URL_USER_CENTER;//指定回退地址
    }
  },
  //创建历史记录，第一个state为null
 beforeCreated(){
    window.history.pushState({ url: URL_USER_CENTER }, null, "");
  }
//监听popstate事件
 activated() {
    window.addEventListener("popstate", this.callback, false);
  },
  //移除popstate事件，使监听只作用在当前页面
 deactivated() {
    window.removeEventListener("popstate", this.callback, false);
  }
  
//**********************************************//

// 历史记录堆栈
window.history.pushState({url:location.href},null,"")
//保存跳转源地址
if(location.pathname != "/msgCenter/"){
  sessionStorage.setItem("referrer",document.referrer)
}
// 监听返回/前进
window.addEventListener(
  "popstate",
  function(e) {
    let state = e.state;
    //第一个页面加载时 state 为空
    if (!state){
    //跳转地址
      location.href = sessionS.getItem("referrer");
    }
    let url = state.url;
    //不想回退的地址，正则
    let reg = /openId=/i;
    //跳回源地址条件判断
    if (reg.test(url) || paseUrl(url).pathname == "/msgCenter/") {
      location.href = sessionStorage.getItem("referrer");
    }
  },
  false
);
```
## VisibilityChange 事件；用于判断用户是否离开当前页面

```js
// 页面的 visibility 属性可能返回三种状态 
// prerender，visible 和 hidden 
let pageVisibility = document.visibilityState; 
// 监听 visibility change 事件 
document.addEventListener('visibilitychange', function() {
  // 页面变为不可见时触发 
  if (document.visibilityState == 'hidden') { ... } 
  // 页面变为可见时触发 
  if (document.visibilityState == 'visible') { ... } 
  }
);
//////////////////////////////////////////////////////////////
var hiddenProperty = 'hidden' in document ? 'hidden' :    

   'webkitHidden' in document ? 'webkitHidden' :    

   'mozHidden' in document ? 'mozHidden' :    

   null;

var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

var onVisibilityChange = function(){

   if (!document[hiddenProperty]) {    

       console.log('页面非激活');

   }else{

       console.log('页面激活')

   }

}

document.addEventListener(visibilityChangeEvent, onVisibilityChange);
```

## 时间转换

```js
//ios不支持2018-05-11 12:00:00格式转换
// 兼容处理
new Date('2018-05-11 12:00:00'.replace(/-/g, '/'))
```
## 判断空对象
1.JSON.stringify()

```js
if(JSON.stringify(data)==='{}'){
  // 空对象
  return true
}else{
  // 非空对象
  return false
}
```
2.Object.keys()

```js
if(Object.keys(data).length===0){
  // 空对象
  return true
}else{
  // 非空对象
  return false
}
```

## 函数式组件
将组件标记为`functional`，这意味着它无状态（没有响应式数据），也没有实例（没有`this`上下文），它只是一个接受一些 prop 的函数.   

适用场景：
- 程序化地在多个组件中选择一个来代为渲染
- 在将`children、props、data`传递给组件之前操作他们

优点：
- 因为函数式组件只是函数，所以渲染开销也低很多

```js
Vue.component('my-component', {
  functional: true,
  // Props 是可选的,在 2.3.0 或以上的版本中，
  // 所有组件上的特性都会被自动隐式解析为 prop。
  props: {
    // ...
  },
  // 为了弥补缺少的实例
  // 提供第二个参数作为上下文
  render: function (createElement, context) {
    // ...
  }
})
```
### context包含字段
- `props`：提供所有`prop`的对象
- `children`：`VNode`子节点的数组
- `slots`：一个函数，返回了包含所有插槽的对象
- `scopedSlots`：（2.6.0+）一个暴露传入的作用域插槽的对象。也可以函数形式暴露普通插槽。
- `data`：传递组件的整个数据对象，作为`createElement`的第二参数传入组件
- `parent`：对父组件的引用
- `listeners`：（2.3.0+）一个包含了所有父组件为当前组件注册的事件监听的对象。这是`data.on`的一个别名
- `injections`：（2.3.0+）如果使用了`inject`选项，则该对象包含了应该被注入的属性

在普通组件中，没有被定义为prop的特性会自动添加到组件的根元素上，将已有的同名特性进行替换或者与其进行智能合并。然而函数式组件要求要显示定义该行为。
```js
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // 完全透传任何特性、事件监听器、子节点等。
    return createElement('button', context.data, context.children)
  }
})
```

### 单文件组件（2.5.0及以上）   
因为可以访问到其独立的上下文内容，所以可以使用 `data.attrs` 传递任何 HTML 特性，也可以使用 `listeners` (即 `data.on` 的别名) 传递任何事件监听器。
```html
<template functional>
  <button
    class="btn btn-primary"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <slot/>
  </button>
</template>
```

## 递归组件
- 需要给组件设置一个name
- 需要有明确的结束条件

## 其他
1. 域名为localhost，参数会被URI转义
2. p 标签中不允许放置任何块级元素

## echart 按需引入
```js
// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById("echart"));
// 绘制图表
myChart.setOption({
  title: {
    text: "ECharts 入门示例"
  },
  tooltip: {},
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
  },
  yAxis: {},
  series: [
    {
      name: "销量",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
});
```
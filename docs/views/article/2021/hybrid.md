---
title: hybrid
date: 2021-01-25
tags: 
- hybrid
categories: 
- 文章
---

## 混合方案

现在比较流行的混合方案主要有三种，主要是在UI渲染机制上的不同
### Webview UI

- 通过 JSBridge 完成 H5 与 native 的双向通信，并基于 Webview 进行页面的渲染
- 优势：简单易用，架构门槛/成本相对较低，适用性与灵活性较强
- 劣势：Webview性能局限，在复杂场景中，表现远不如原生页面

### Native UI

方案示例：有 React Native 和 weex
- 通过 JSBridge 赋予 H5 原生能力，并进一步将 JS 生成的虚拟节点树（vdom）传递至 Native 层，并使用原生系统渲染
- 优势：用户体验上基本接近原生，并且发挥web技术开发灵活与易更新特性
- 劣势：上手/改造门槛较高，最好需要掌握一定程度的客户端技术，相比于常规web开发，需要更高的开发调试、问题排查成本
### 小程序

方案示例：微信小程序
- 通过更加定制化的 JSBridge ，赋予了 web 更加强大的权限，并使用双 Webview 双线程的模式隔离的JS逻辑与UI渲染，形成特殊的开发模式，加强了 H5 与 Native 混合程度，属于 Webview UI 方案的优化版本
- 优势：用户体验好于常规的 Webview UI 方案，且通常依托平台也能提供更为友好的开发调试体验以及功能
- 劣势：需要依托于特定的平台规范限定

## Webview

Webview 是 Native APP 中内置的一款基于 webkit内核的浏览器，主要由两部分组成

- WebCore 排版引擎
- JSCode 解析引擎

在原生开发 SDK 中 Webview 被封装成了一个组件，用于作为 Web 页面的容器。因此，作为宿主的客户端中拥有更高的权限，可以对 Webview 中的 Web 页面进行配置和开发

HyBrid技术中双端的交互原理，便是基于 Webview 中的一些 API 和特性

## 交互原理

Hybrid技术中最为核心的点就是 Native 端与 H5 端之间的**双向通讯层**（跨语言通讯方案）

- JavaScript 通知 Native
  - **API注入**：Native 直接在 JS 上下文中挂载数据或者方法
    - 优势：延时较低
    - 劣势：在安卓4.1以下具有安全性问题，风险较高
  - **Webview URL Schema 跳转拦截**：
    - 优势：兼容性较好
    - 劣势：延迟较高，且有长度限制
  - Webview 中的 **prompt、console、alert拦截**（通常使用prompt）
- Native 通知 JavaScript
  - IOS：**stringByEvaluatingJavaScriptFromString**
  ``` JS
  // Swift
  webview.stringByEvaluatingJavaScriptFromString("alert('NativeCall')")
  ```
  - Android: **loadUrl** (4.4-)
  ``` JS
  // 调用js中的JSBridge.trigger方法
  // 该方法的弊端是无法获取函数返回值；
  webView.loadUrl("javascript:JSBridge.trigger('NativeCall')")
  ```
  Android: **evaluateJavascript** (4.4+)
  ``` JS
  // 4.4+后使用该方法便可调用并获取函数返回值；
  mWebView.evaluateJavascript（"javascript:JSBridge.trigger('NativeCall')", new ValueCallback<String>() {
      @Override
      public void onReceiveValue(String value) {
          //此处为 js 返回的结果
      }
  });
  ```

## 接入方案

整套方案需要 Web 和 Native 配合完成
- Native：负责实现**URL拦截与解析、环境信息的注入、拓展功能的映射、版本更新**等功能
- JavaScript：负责实现功能**协议的拼装、协议的发送、参数的传递、回调**等一系列基础功能

接入方式
- 在线H5：直接将项目部署于线上服务器，并由客户端在HTML头部注入对应的 Bridge
  - 优势：接入/开发成本低，对APP的侵入小
  - 劣势：重度依赖网络，无法离线使用，首屏加载慢
- 内置离线包：将代码直接内置于APP中，即本地存储中，可由H5或者客户端引用 Bridge
  - 优势：首屏加载快，可离线使用
  - 劣势：开发、调试成本高，需要多端合作，且会增加APP体积

## 优化方案

- **Webview 预加载**：Webview 的初始化其实挺耗时的。我们测试过，大概在100~200ms之间，因此如果能前置做好初始化于内存中，会大大加快渲染速度。
- **更新机制**：使用离线包的时候，便会涉及到本地离线代码的更新问题，因此需要建立一套云端下发包的机制，由客户端下载云端最新代码包 (zip包)，并解压替换本地代码。
  - **增量更新**：由于下发包是一个下载的过程，因此包的体积越小，下载速度越快，流量损耗越低。只打包改变的文件，客户端下载后覆盖式替换，能大大减小每次更新包的体积。
  - **条件分发**: 云平台下发更新包时，可以配合客户端设置一系列的条件与规则，从而实现代码的条件更新
    - 单 **地区** 更新: 例如一个只有中国地区才能更新的版本
    - 按 **语言** 更新: 例如只有中文版本会更新
    - 按 **App 版本** 更新: 例如只有最新版本的 App 才会更新
    - **灰度** 更新: 只有小比例用户会更新
    - **AB测试**: 只有命中的用户会更新
- **降级机制**：当用户下载或解压代码包失败时，需要有套降级方案，通常有两种做法
  - **本地内置**：随着 App 打包时内置一份线上最新完整代码包，保证本地代码文件的存在，资源加载均使用本地化路径
  - **域名拦截**：资源加载使用线上域名，通过拦截域名映射到本地路径。当本地不存在时，则请求线上文件，当存在时，直接加载
- **跨平台部署**：Bridge层 可以做一套浏览器适配，在一些无法适配的功能，做好降级处理，从而保证代码在任何环境的可用性，一套代码可同时运行于 App内 与 普通浏览器
- **环境系统**：与客户端进行统一配合，搭建出 **正式 / 预上线 / 测试 / 开发环境**，能大大提高项目稳定性与问题排查
- **开发模式**
  - 能连接PC Chrome/safari 进行代码调试
  - 具有开发调试入口，可以使用同样的 Webview 加载开发时的本地代码
  - 具备日志系统，可以查看 Log 信息
## hybrid 是什么，为何用 hybrid？

- hybrid 文字解释：混合
  - 前端和客户端的混合开发
  - 需要前端开发人员和客户端开发人员配合完成
  - 某些环节也可能涉及到sever端
- 存在价值，为何用hybrid
  - 可以**快**速迭代更新【关键】（无需app审核）
  - 体验流畅（和NA的体验基本类似）
  - 减少开发和沟通成本，双端公用一套代码
- webview
  - 是app中的一个组件（APP可以有webview，也可以没有）
  - 用于加载h5页面，即一个小型的浏览器内核
- file:// 协议
  - 强调 “协议” “标准” 的重要性
  - file协议：本地文件，快
  - http(s)协议：网络加载，慢
  - file://和整个url的关系【重要】，file:// + 本地绝对路径
- hybrid实现流程
  - 前端做好静态页面（html，js，css），将文件交给客户端
  - 客户端拿到前端静态页面，以文件形式存储在app中
  - 客户端在一个webview中
  - 使用file协议加载静态页面

![hybrid实现模型](/img/hybrid实现模型.png)

## 介绍一下hybrid更新和上线的流程？

- 要替换每个客户端静态文件
- 只能客户端来做（客户端也是我们开发的）
- 客户端去server下载最新文件
- 我们维护sever端静态文件
- **静态文件打成包，发布服务器，包版本管理: v20210425**
- **启动客户端时对比版本，不一致下载最新压缩包并解压覆盖**
![hybrid更新流程](/img/hybrid更新流程.png)

## hybrid和h5的主要区别？

- 优点
  - 可以**快**速迭代更新【关键】（无需app审核）
  - 体验流畅（和NA的体验基本类似）
- 缺点
  - 开发成本高，联调、测试、查bug都比较麻烦
  - 运维成本高
- 使用场景
  - 不是所有场景都适合使用hybrid
  - 使用NA：体验要求极致，变化不频繁
  - 使用hybrid：产品的稳定功能，体验要求高，变化频繁
  - 使用h5：单次的运营活动（如xx红包），或者不常用，体验无要求，不常用（如举报，反馈等页面）

## 使用hybrid，前端如何获取内容

- 不能用ajax获取，第一跨域，第二速度慢
- 客户端获取内容，然后js通信拿到内容，再渲染
- 客户端预加载数据

## 前端js和客户端如何通讯？

- js访问客户端能力，传递参数和回调函数
- 客户端通过回调函数返回内容（类似jsonp）

## schema协议简介和使用

- schema协议-前端和客户端通讯的约定
- 协议格式 xxx://xx/xx,如 weixin://del/scan

## schema使用的封装

``` JS
(function (window,undefined) {
  /**
   * 通讯方法
   * @param {String} protocol 协议名称
   * @param {string|Object} params 传参
   * @param {String} callback 回调函数名
   */
  function _invoke(protocol,params,callback) {
    // 参数解析
    let query = '',callbackName = ''
    if(typeof params === 'object'){
      for(let key in params){
        query += key + '=' + params[key]
      }
    }else if(typeof params === 'string') {
      query = params
    }
  
    if(typeof callback === 'string'){
      callbackName = callback
    }else {
      // 定义回调方法
      callbackName = protocol + new Date.now()
      window[callbackName] = callback
    }
    let iframe = document.createElement('iframe')
  
    iframe.style.display = 'none'
    iframe.src = protocol + '?' + query + 'callback=' + callbackName  // iframe 访问 schema
  
    let body = document.body || document.getElementsByTagName('body')[0]
    body.appendChild(iframe)
  
    setTimeout(()=>{
      body.removeChild(iframe) // 销毁 iframe
      iframe = null
    })
  }
  
  window.invoke = {
    share(params, callback) {
      _invoke('weixin://dl/share',params,callback)
    },
    scan(params, callback) {
      _invoke('weixin://dl/scan',params,callback)
    }
  }
})(window)
```
## 内置上线

- 将封装代码打包，叫做invoke.js，内置到客户端
- 客户端每次启动webview，都默认执行invoke.js
- 本地加载，免去网络加载的时间，更快

## 总结

- 通讯的基本形式：调用能力，传递参数，监听回调
- 对schema协议的理解和使用
- 调用schema代码的封装
- 内置上线的好处：更快、更安全
---
title: hybrid
date: 2021-01-15
tags: 
- hybrid
categories: 
- 文章
---

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
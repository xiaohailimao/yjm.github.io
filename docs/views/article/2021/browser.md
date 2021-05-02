---
title: 浏览器
date: 2019-03-10
tags: 
- 浏览器
categories: 
- 文章
---

## postMessage

这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息

```js
// 发送消息端
window.parent.postMessage('message','http://xxx.com')
// 接收消息端
var mc = new MessageChannel()
mc.addEventListener('message',(event)=>{
  var origin = event.origin || event.originaEvent.origin

  if(origin == 'http://xxx.com'){
    console.log('验证通过')
  }
})
```

## 安全

### 常见的web前端攻击方式有哪些

- XSS跨站请求攻击
  - 一个博客网站，我发表一篇文章，其中嵌入`<script>`脚本
  - 脚本内容：获取cookie，发送到我的服务器（服务器配合跨域）
  - 发布文章，有人查看了，我就轻松获取访问者的cookie信息
  - 预防
    - 替换特殊字符，如`<`变为`&lt;`,`>`变为`&gt;`
    - `<script>`变成了`&lt;script&gt;`，直接显示，不会作为脚本被执行
    - 前端要替换，后端也要替换，都做总没错
    - npm包:xss
- XSRF跨站请求伪造
  - 你正在购物，看中了某个商品，商品id=100
  - 付款接口是`xxx.com/pay?id=100`，但没有任何验证
  - 我是攻击者，我看中了一个商品，商品id=200
  - 向你发送一封邮件，邮件标题比较诱人
  - 但是邮件正文隐藏这`<img src="xxx.com/pay?id=200" />`，这时就会把`xxx.com`域名下用户信息带过去了，img可以跨域请求
  - 你查看邮件，就会帮我买了商品id=200的商品
  - 预防
    - 使用post接口
    - 增加验证，例如密码、短信校验码、指纹等

## 网页加载过程
### 问题

- 从输入url到渲染出页面的整个过程
  - 下载资源：各个资源类型，下载过程
  - 渲染页面：结合html、js、css、图片等
- window.onload 和 DOMContentLoaded 区别
  - window.onload：页面的全部资源全部加装完成才会执行，包括图片、视频等
  - DOMContentLoaded：DOM渲染完成即可，此时图片、视频可能还没加载完成

### 知识点

- 加载资源的形式
  - html代码
  - 媒体文件，如图片、视频等
  - js、css
- 加载资源的过程
  - DNS解析（域名解析服务）：域名=>IP地址
  - 浏览器根据IP地址向服务器发起http请求
  - 服务器处理http请求，并返回资源给浏览器
- 渲染页面的过程
  - 根据html代码生成DOM（document object model）树
  - 根据css代码生成CSSOM（css object model）
  - 将DOM树和CSSOM整合成render tree
  - 浏览器根据 render tree 渲染页面
  - 遇到`<script>`暂停渲染，优先加载并执行js代码，完成之后继续渲染
- 为何建议把css放在head中？
  - 减少重复渲染
- 为何建议把js放到body最后
  - js会阻塞页面渲染
  - js放到最后可以先完成页面渲染，加快页面显示（首屏加载）
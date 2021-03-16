---
title: 浏览器
date: 2021-03-10
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
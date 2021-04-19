---
title: HTML
date: 2020-04-01
tags:
 - HTML
categories:
 -  文章
---
## HTML <input type="file"> 文件上传

调用摄像机来捕获图像或视频数据

```html
<!-- 应使用面向用户的摄像头和/或麦克风 -->
<input type="file" id="imageFile" capture="user" accept="image/*">
```

```html
<!-- 应使用朝外的摄像头和/或麦克风 -->
<input type="file" id="imageFile" capture="environment" accept="image/*">
```

## 如何理解html语义化

- 让人更容易读懂（增加代码可读性）
- 让搜索引擎更容易读懂（SEO）
## 默认情况下，哪些HTML标签是块级元素，哪些是内联元素

- display：block/table；有div h1 h2 table ul ol p等
- display：inline/inline-block；有span img input button等

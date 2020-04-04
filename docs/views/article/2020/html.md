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
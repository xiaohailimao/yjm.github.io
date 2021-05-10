---
title: nodejs 开发博客系统
date: 2019-01-15
tags: 
- nodejs
categories: 
- 文章
---

## 接口开发（不用框架）

- nodejs处理http请求
- 搭建开发环境
- 接口开发（暂时不考虑数据库，不考虑登录）

### http请求概述

- DNS解析，建立TCP连接，发送http请求
- server端接收到http请求，处理， 并返回
- 客户端接收返回数据，处理数据（渲染页面，执行js）

### get
- querystring
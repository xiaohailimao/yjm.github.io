---
title: HTTP
date: 2021-02-02
tags:
  - HTTP
categories:
  - 文章
---

## HTTP 协议的主要特点

无连接，无状态，简单快速，灵活

## HTTP 报文组成部分

1. 请求报文：请求行=>请求头=>空行=>请求体
2. 响应报文：响应行=>响应头=>空行=>响应体

## HTTP 方法

1. GET（获取资源）
2. POST（传输资源）
3. PUT（更新资源）
4. DELETE（删除资源）
5. HEAD（获得报文首部）

## POST 和 GET 的区别

1. GET 在浏览器回退时是无害的，POST 会再次请求
2. GET 产生的 URL 地址可以被收藏，POST 不行
3. GET 请求会被浏览器主动缓存，POST 不会缓存，除非手动设置
4. GET 请求只能用 URL 编码，而 POST 支持多种编码方式
5. GET 请求参数会被完整保留在浏览器历史记录里，POST 不会
6. GET 请求在 URL 中传送的参数是有长度限制的，POST 没有限制
7. GET 只接受 ASCLL 码的参数类型，POST 没有限制
8. GET 比 POST 更不安全，参数暴露在 URL 上，不能用来传输敏感信息
9. GET 参数通过 URL 传递，POST 放在 Request body 中

## HTTP 状态码
分类
- 1xx：指示信息-表示请求已接收，继续处理
- 2xx：成功-表示请求已被成功接收
- 3xx：重定向-要完成请求必须进行更进一步操作
- 4xx：客户端错误-请求有语法错误或者请求无法实现
- 5xx：服务器错误-服务器未能实现合法的请求

常用状态码

- 200 OK：客户端请求成功
- 206 Partial Content：客户端发送一个带有 Range 头的 GET 请求，服务器完成了它
- 301 Moved Permanently：所有请求的页面已经转移至新的 URL
- 302 Found：所请求的页面已经临时转移至新的 URL
- 304 Not Modified：客户端有缓存的文档并发出了一个条件性的请求，服务器告诉客户，原来缓存的文档还可以继续使用
- 400 Bad Request：客户端请求有语法错误，不能被服务器所理解
- 401 Unauthoruzed：请求未经授权，这个状态码必须和 www-Authenticate 报头域一起使用
- 403 Forbidden：对被请求页面的访问被禁止
- 404 Not Found：请求资源不存在
- 500 internal Server Error：服务器发生不可预期的错误原来缓存的文档还可以继续使用
- 503 Server Unavailable：请求未完成，服务器临时过载或当机，一段时间后可能恢复正常
- 504 网关超时

## 持久连接

HTTP 协议采用“请求-应答”模式，当使用普通模式，即非 Keep-Alive 模式时，每个请求和应答客户和服务器都要更新建立一个连接，完成后立即断开连接（HTTP 协议为无连接的协议）

当使用 Keep-Alive 模式（持久连接，连接重用，HTTP/1.1 可用）时，Keep-Alive 功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive 功能避免了建立或重新建立链接

## 管线化

在使用持久连接的情况下，某个连接上消息的传递类似于

请求 1->响应 1->请求 2->响应 2->请求 3->响应 3

某个连接上的消息变成了类似这样

请求 1->请求 2->请求 3->响应 1->响应 2->响应 3

1. 管线化机制通过持久连接完成，仅 HTTP/1.1 支持此技术
2. 只有 GET 和 HEAD 请求可用进行管线化，而 POST 有所限制
3. 初次创建连接时不应启动管线化机制，因为对方（服务器）不一定支持 HTTP/1.1 版本的协议
4. 管线化不会影响响应到来的顺序
5. HTTP/1.1 要求服务器端支持管线化，但并不要求服务器也对响应进行管线化处理，只是要求对于管线化的请求不失败即可
6. 由于上面提到的服务器问题，开启管线化很可能并不会带来大幅度的性能提升，而且很多服务器端和代理程序对管线化支持并不好，因此现代浏览器如 Chrome 和 Firefox 默认并未开启管线化支持

## 关于协议和规范

- 就是一个约定
- 要求大家跟着执行
- 不要违反规范，例如IE浏览器
## HTTP Methods

- 传统的 methods
  - get 获取服务器的数据
  - post 向服务器提交数据
  - 简单的网页就这两操作
- 现在的 methods
  - get 获取数据
  - post 新建数据
  - patch/put 更新数据
  - delete 删除数据
## Restful API

- 一种新的API设计方法
- **传统API设计：把每个url当做一个功能**
- **Restful API：把每个url当做一个唯一的资源**
- 如何设计一个资源
  - **尽量不用url参数**
    - 传统API设计：/api/list?pageIndex=2
    - Restful API设计：/api/list/2
  - 用methods表示操作类型
    - 传统API设计
      - post请求：/api/create-blog
      - post请求：/api/update-blog?id=100
      - get请求：/api/get-blog?id=100
    - Restful API设计
      - **post请求：/api/blog**
      - **patch请求：/api/blog/100**
      - **get请求：/api/blog/100**

## HTTP Headers

### request headers

- `Accept` 浏览器可接收的数据格式
- `Accept-Encoding` 浏览器可接收的压缩算法，如gzip
- `Accept-Language` 浏览器可接收的语言，如zh-CN
- `Connection: keep-alive` 一次TCP连接重复使用
- `Cookie`
- `Host`
- `User-Agent`（简称UA） 浏览器信息
- `Content-Type` 发送数据的格式，如 `application/json`
- 自定义header：headers:{ token: xxx }

### response headers

- `Content-Type` 返回数据的格式，如`application/json`
- `Content-Length` 返回数据的大小，多少字节
- `Content-Encoding` 返回数据的压缩算法，如`gzip`
- `Set-Cookie`
- 自定义header: headers:{ xxx: xxx }
### 缓存 headers

- Cache-Control
  - **max-age** 缓存时间，单位秒
  - **no-cache** 不缓存
  - no-store 不缓存，也不采用服务端缓存策略
  - private 仅允许客户端缓存
  - public 允许代理缓存
- `Last-Modified` 资源的最后修改时间
- `Etag` 根据内容计算的资源的唯一标识（一个字符串）
- `Expires`
  - 同在response headers中
  - 同为控制缓存过期
  - 已被Cache-Control代替
- `If-Modified-Since` request header 中带的`最近的 Last-Modified 值`
- `If-None-Match` request header 中带的`最近的 Etag 值`
## HTTP 缓存

### 关于缓存的介绍
  - 什么是缓存
  - 为什么要缓存
  - 哪些资源可以被缓存，--静态资源（js，css，img）
### HTTP 缓存策略（强制缓存+协商缓存）

- 强制缓存：`Cache-Control`，未过期前没走服务端
- 协商缓存（对比缓存），会走服务端
  - 服务器缓存策略。服务端判断是不是可以被缓存，不是缓存在服务器
  - 服务器判断客户端资源，是否和服务端资源一样
  - 一致返回304，否则返回200和最新的资源
  - `Last-Modified` 资源的最后修改时间
  - `If-Modified-Since` request header 中带的最近的 `Last-Modified` 值
  - `Etag` 资源的唯一标识（一个字符串）
  - `If-None-Match` request header 中带的最近的 `Etag` 值
  - **`Last-Modified` 和 Etag 共存，优先使用 Etag**
  - `Last-Modified` 只能精确到秒级
  - 如果资源重复生成，而内容不变，则 `Etag` 更精准
### 刷新操作方式，对缓存的影响

- 正常操作：地址栏输入url，跳转连接，前进后退；强制缓存，协商缓存有效
- 手动刷新：f5，点击刷新按钮，右击刷新菜单；强制缓存失效，协商缓存有效
- 强制刷新：ctrl + f5；强制缓存，协商缓存失效

## HTTPS
## HTTP2
## 跨域

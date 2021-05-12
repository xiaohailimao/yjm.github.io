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
- **HTTPS 是一个在计算机世界里专门在两点之间安全的传输文字、图片、音频、视频等超文本数据的约定和规范**
- HTTPS 是 HTTP 协议的一种扩展，它本身并不保传输的证安全性，那么谁来保证安全性呢？在 HTTPS 中，使用`传输层安全性(TLS)`或`安全套接字层(SSL)`对通信协议进行加密。也就是 `HTTP + SSL(TLS) = HTTPS`。
- HTTPS做了什么
  - 加密
    - 对称加密：加密和解密时使用的密钥都是同样的密钥
    - 加密分组：它可以让算法用固定长度的密钥加密任意长度的明文
    - 非对称加密(公钥加密)：非对称加密中有两个密钥，一个是公钥，一个是私钥，公钥进行加密，私钥进行解密
    - **混合加密**：在通信刚开始的时候使用非对称算法，比如 RSA、ECDHE ，首先解决密钥交换的问题。然后用随机数产生对称算法使用的会话密钥（session key），再用公钥加密。对方拿到密文后用私钥解密，取出会话密钥。这样，双方就实现了对称密钥的安全交换。
  - 数据一致性
    - 摘要算法
    - MAC：它通过 MAC 算法从消息和密钥生成，MAC 值允许验证者（也拥有秘密密钥）检测到消息内容的任何更改，从而保护了消息的数据完整性。
    - **HMAC**：它是使用 MAC 值 + Hash 值的组合方式，HMAC 的计算中可以使用任何加密哈希函数，例如 SHA-256 等
  - 身份认证
    - **数字签名**：私钥加密，公钥解密。使用`私钥`再加上`摘要算法`就实现`数字签名`
    - 签名请求(CSR)：CSR 是一个编码的文本文件，其中包含公钥和其他将包含在证书中的信息（例如域名，组织，电子邮件地址等）。密钥对和 CSR 生成通常在将要安装证书的服务器上完成，并且 CSR 中包含的信息类型取决于证书的验证级别
    - CA：证书认证机构，DV最低只验证域名可信，EV最高经过了法律和审计的严格核查，可以证明网站拥有者的身份（在浏览器地址栏会显示出公司的名字，例如 Apple、GitHub 的网站）
- HTTPS默认端口号443
- HTTPS 就是身披了一层 SSL 的 HTTP
- TLS是SSL后继版本
- TLS(主流TLS1.2版本)
  - 用于两个通信应用程序之间提供`保密性和数据完整性`。
  - TLS 由`记录协议`、`握手协议`、`警告协议`、`变更密码规范协议`、`扩展协议`等几个子协议组成，综合使用了`对称加密`、`非对称加密`、`身份认证`等许多密码学前沿技术
  - 命名规范：密钥交换算法 - 签名算法 - 对称加密算法 - 摘要算法
  > 例：ECDHE-ECDSA-AES256-GCM-SHA384  
  > 解释：使用 ECDHE 进行密钥交换，使用 ECDSA 进行签名和认证，然后使用 AES 作为对称加密算法，密钥的长度是 256 位，使用 GCM 作为分组模式，最后使用 SHA384 作为摘要算法
## HTTP2

四个特性
- `多路复用`，无需多个TCP连接，因为其允许在单一的HTTP2连接上发起多重请求，因此可以不依赖建立多个TCP连接
- `二进制分帧`，将所有传输的信息采用二进制编码，并且会将信息分割为更小的信息块
- `头部压缩`，采用HPACK技术压缩头部，减小报文体积
- `服务端推送`，服务端可以对客户端发的一个请求发送多个响应，并且资源可以正常缓存

``` BASH
server {
  listen 443 ssl http2
}
```
::: warning
使用 http2 的前提是必须是 https
:::
## 跨域
### jsonp

- 利用 `<script>` 可以绕过同源策略功能
- 服务器返动态拼接数据
- 只能get传参

``` js
// promise 版本 jsonp
function jsonp(url, params, callbackName) {
  // 拼接参数和地址
  const genUrl = function () {
    let data = ''
    for (let key in params) {
      data += `${key}=${params[key]}&`
    }
    data += `callback=${callbackName}`
    return `${url}?${data}`
  }

  return new Promise((resolve, reject) => {
    callbackName = callbackName || Math.random().toString()
    
    const script = document.createElement('script')
    script.src = genUrl()
    document.body.appendChild(script) // 动态插入script标签，请求数据拼接在src上

    window[callbackName] = function (data) {
      document.body.removeChild(script) // 用完就删除插入的script标签
      resolve(data) // 返回数据
    }
  })
}
```
### CORS 跨域资源共享

CORS 实现起来非常方便，只需要增加一些 HTTP 头，让服务器能声明允许的访问来源

以koa配置为例

``` JS
app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200; 
  } else {
    await next();
  }
})
```

### proxy

案例一：vue.config.js
``` JS
amodule.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 8084,
        open: true,// vue项目启动时自动打开浏览器
        proxy: {
            '/api': { // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
                target: "http://xxx.xxx.xx.xx:8080", //目标地址，一般是指后台服务器地址
                changeOrigin: true, //是否跨域
                pathRewrite: { // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
                    '^/api': "" 
                }
            }
        }
    }
}
```

案例二：express

``` JS
var express = require('express');
const proxy = require('http-proxy-middleware')
const app = express()
app.use(express.static(__dirname + '/'))
app.use('/api', proxy({ target: 'http://localhost:4000', changeOrigin: false}));
module.exports = app
```

案例三：Nginx

``` JS
server {
    listen    80;
    # server_name www.josephxia.com;
    location / {
        root  /var/www/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass  http://127.0.0.1:3000;
        proxy_redirect   off;
        proxy_set_header  Host       $host;
        proxy_set_header  X-Real-IP     $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
}
```
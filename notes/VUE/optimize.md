# 性能优化
## Vue-CLI 3.0 开启gzip压缩配置
安装压缩插件
```npm
yarn add compression-webpack-plugin -D
```
vue-cli配置
```js
// vue.config.js
const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            //GZIP压缩
            return {
                plugins: [new CompressionWebpackPlugin({
                    test: /\.(js|css)(\?.*)?$/i, //需要压缩的文件正则
                    threshold: 100,//文件大小大于这个值时启用压缩
                    deleteOriginalAssets: false//压缩后是否删除原文件
                })]
            };
        }
    },
}
```
nginx配置
```
// nginx.conf
gzip on; // 启用或禁用gzipping响应
gzip_min_length 1000; //设置将被gzip压缩的响应的最小长度。长度仅由“Content-Length”响应头字段确定。
gzip_buffers 16 64k; // 设置用于压缩响应的缓冲区number和size
gzip_http_version 1.1; // 设置压缩响应所需的最低HTTP请求版本
gzip_comp_level 9; // 设置level响应的gzip压缩。可接受的值范围为1到9
gzip_types text/plain text/javascript application/javascript image/jpeg image/gif image/png application/font-woff application/x-javascript text/css application/xml; //除了“ text/html” 之外，还允许对指定的MIME类型进行gzipping响应。特殊值“ *”匹配任何MIME类型（0.8.29）。text/html始终压缩具有“ ”类型的响应。
gzip_vary on; // 如果指令gzip， gzip_static或gunzip 处于活动状态， 则启用或禁用插入“Vary：Accept-Encoding”响应头字段 。
```
::: tip 提示
如果服务器已经开启gzip压缩，生成代码可以不压缩
:::

## 图片压缩
1. 本地工具无损压缩
- Photoshop cc 插件[TinyPNG](https://pan.baidu.com/s/1ZBdHtb-fLT1kV3byf6C9MA) 支持png、jpg，无文件大小限制， 压缩率大于50%（提取码r3bj）

2. 在线无损压缩
- [TinyPNG](https://tinify.cn/) 支持png、jpg，APNG，支持20张批量上传（max 5M），压缩率大于50%
- [压缩图](https://www.yasuotu.com/) 支持png、jpg、gif，支持6张批量上传（max 5M），压缩率大于50%

## APNG 动态png图
- [APNG Assembler](https://sourceforge.net/projects/apngasm/) 从PNG / TGA图像序列创建高度优化的动画PNG文件。CLI版本适用于所有主要操作系统。适用于Windows和macOS的GUI版本
- [APNGb](https://github.com/shgodoroja/APNGb) mac版本
- [APNG相关介绍](https://aotu.io/notes/2016/11/07/apng/)

1. GIF   
- 最多支持 8 位 256 色，色阶过渡糟糕，图片具有颗粒感
- 不支持 Alpha 透明通道，边缘有杂边   
2. APNG：
- 支持 24 位真彩色图片
- 支持 8 位 Alpha 透明通道
- 向下兼容 PNG

大部分情况下 APNG 依旧能比 GIF、WebP 以及有损的 WebP 的体积小

## CDN 加速
```html
<!-- index.html -->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- 去除点击延迟，禁止缩放 -->
    <meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">
    <!-- 禁止被内嵌 -->
    <!-- <meta http-equiv="X-Frame-Options" content="deny"> -->
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <!-- vue.js cdn 地址-->
    <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js" rel="preload"></script>
    <!-- vuex.js cdn 地址-->
    <script src="https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js" rel="preload"></script>
    <!-- vue-router.js cdn 地址-->
    <script src="https://cdn.bootcss.com/vue-router/3.0.6/vue-router.min.js" rel="preload"></script>
    <title>demo</title>
  </head>
```
vue cli 配置
```js
module.exports = {
  configureWebpack: {
    externals: {
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter"
    }
  }
};
```
[webpack externals](https://webpack.docschina.org/configuration/externals/)

::: tip 提示
1. 对于当前页面很有必要的资源使用 `preload`，对于可能在将来的页面中使用的资源使用 `prefetch`。
[prefetch preload 相关文章](https://juejin.im/post/58e8acf10ce46300585a7a42)

2. 要不要用cdn根据实际情况，有时候会导致负优化
:::

## 静态资源压缩方案
1. 开启gzip压缩，js，css文件使用gzip压缩
2. 图片资源使用TinyPNG压缩
3. 动态图使用APNG替换gif，用APNG Assembler生成，然后在TinyPNG在线压缩

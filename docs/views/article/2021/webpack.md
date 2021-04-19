---
title: Webpack5
date: 2021-02-13
tags: 
- Webpack
categories: 
- 文章
---

## 基本配置

- 拆分配置和merge
- 启动本地服务

## 抽离压缩css

- 用于生产环境
- mini-css-extract-plugin、terser-webpack-plugin、optimize-css-assets-webpack-plugin

```js
const { join } = require('path')
const { srcPath, distPath } = require('paths')
// css 抽离 插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩代码插件
const TerserJSPlugin = require('terser-webpack-plugin')
// 压缩css代码插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 清除 output.path 路径下内容
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: join(srcPath,'main.js'),
    output: {
        filename: 'bundle.[contenthash:8].js',
        path: distPath
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use:[
                    // 这里不是style-loader，抽离成单独css文件
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                    'postcss-loader'
                ]
            }
        ]
    },
    plugins:[
        // 默认清空 output.path 文件夹
        new CleanWebpackPlugin(),
        // 定义环境变量
        // window.ENV = 'production'
        new webpack.DefinePlugin({ ENV: JSON.stringify('production') }),
        // 抽离css
        new MiniCssExtractPlugin({
            filename: join(distPath,'css','main.[contenthash:8].css')
        })
    ],
    optimization: {
        // 压缩css
        minimizer: [new TerserJSPlugin({}), new OptimizeCssAssetsPlugin({})]
    }
    
}
```

## 代码 splitChunks

chunks产出地方

- entry
- splitChunks
- import()

```js
module.export = {
    optimization :{
        splitChunks: {
            /**
            *   initial 入口chunk，对于异步导入的文件不处理
            *   async 异步chunk，只对异步导入的文件处理
            *   all 全部chunk
            */
            chunks: 'all',
            // 缓存分组
            cacheGroups: {
                // 第三方库
                vendor:{
                    name: 'vendor', // chunks名称
                    priority: 1, // 优先级，权限更高的优先抽离，重要
                    test: /node_modules/, // 匹配路径
                    minSize: 0, // 最小打包限制
                    minChunks: 1 // 最少引用次数，第三方库引用一次就抽离
                },
                // 公用代码
                common:{
                    name: 'common',
                    priority: 0,
                    minSize: 1 * 1024, // 最小打包尺寸，如果太小的就没必要分模块增加http请求
                    minChunks: 2 // 至少引用2次
                },
            }
        }
    }
}
```

## 多页配置

- html-webpack-plugin
- 多个entry 入口配置，多个输出 HtmlWebpackPlugin plugin配置

```js
const { join } = require('path')
const { srcPath, distPath } = require('paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry:{
        index: join(srcPath,'index.js'), // 这个键名就是chunk名，index
        other: join(srcPath,'other.js')
    },
    plugins:[
        new HtmlWebpackPlugin({
            // html 模板
            template: join(srcPath,'index.html'),
            // 输出名称
            filename: 'index.html',
            // chunks配置该html文件引入哪些模块，默认全引入，
            // chunk来源：
            // 1. entry配置的chunk
            // 2. splitChunks配置的chunk，例如：vendor、common
            // 该配置表示只引入entry配置的index chunk
            chunks:['index']
        }),
        new HtmlWebpackPlugin({
            template: join(srcPath,'other.html'),
            filename: 'other.html',
            chunks:['other']
        }),
    ]
}
```

## DllPlugin 动态链接库配置

- DllPlugin 产出dll文件
- DllReferencePlugin 引用dll文件

1. 第一步先生成 dll.js 和 manifest.json

```js
// webpack.dll.js
const { join } = require('path')
const { distPath } = require('./paths')
const DllPlugin = require('webpack/lib/DllPlugin')

module.exports = {
    entry: {
        // 把 React 相关模块的放到一个单独的动态链接库
        react: ['react','react-dom']
    },
    output: {
        // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
        // 也就是 entry 中配置的 react 和 polyfill
        filename: '[name].dll.js',
        path: distPath,
        // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
        // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
        library: '_dll_[name]'
    },
    plugins:[
        new DllPlugin({
            // 动态链接库的全局变量名称，需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
            // 例如 react.manifest.json 中就有 "name": "_dll_react"
            name: '_dll_[name]',
            // 描述动态链接库的 manifest.json 文件输出时的文件名称
            path: join(distPath,'[name].manifest.json')
        })
    ]
}
```

2. development 环境中引用 manifest.json

```js
const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const webpackCommonConf = require('./webpack.common.js')
const { srcPath, distPath } = require('./paths')

// 第一，引入 DllReferencePlugin
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

module.exports = merge(webpackCommonConf, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: srcPath,
                exclude: /node_modules/ // 第二，不要再转换 node_modules 的代码
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            // window.ENV = 'production'
            ENV: JSON.stringify('development')
        }),
        // 第三，告诉 Webpack 使用了哪些动态链接库
        new DllReferencePlugin({
            // 描述 react 动态链接库的文件内容
            manifest: require(path.join(distPath, 'react.manifest.json')),
        }),
    ],
    devServer: {
        port: 8080,
        progress: true,  // 显示打包的进度条
        contentBase: distPath,  // 根目录
        open: true,  // 自动打开浏览器

        // 设置代理
        proxy: {
            // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
            '/api': 'http://localhost:3000',

            // 将本地 /api2/xxx 代理到 localhost:3000/xxx
            '/api2': {
                target: 'http://localhost:3000',
                pathRewrite: {
                    '/api2': ''
                }
            }
        }
    }
})

```

3. index.html模板中手动引入 webpack.dll.js

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
    <!--引入dll文件-->
    <script src="./react.dll.js"></script>
</body>
</html>
```

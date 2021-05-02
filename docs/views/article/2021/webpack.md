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
        minimize: true,
        // 压缩css
        minimizer: [new TerserJSPlugin({ parallel: true }), new OptimizeCssAssetsPlugin({})]
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


## happyPack 多进程打包

- js单线程，开启多进程打包
- 提高构建速度（特别是多核CPU）
- 不再维护，推荐使用 thread-loader

```js
const webpack = require('webpack')
const { smart } = require('webpack-merge')
const HappyPack = require('happypack')
const webpackCommonConf = require('./webpack.common.js')
const { srcPath, distPath } = require('./paths')

module.exports = smart(webpackCommonConf, {
    mode: 'production',
    output: {
        // filename: 'bundle.[contenthash:8].js',  // 打包代码时，加上 hash 戳
        filename: '[name].[contenthash:8].js', // name 即多入口时 entry 的 key
        path: distPath,
        // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
    },
    module: {
        rules: [
            // js
            {
                test: /\.js$/,
                // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
                use: ['happypack/loader?id=babel'],
                include: srcPath,
                // exclude: /node_modules/
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            // window.ENV = 'production'
            ENV: JSON.stringify('production')
        }),
        // happyPack 开启多进程打包
        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'babel',
            // 如何处理 .js 文件，用法和 Loader 配置中一样
            loaders: ['babel-loader?cacheDirectory']
        }),
    ],
})
```

## thread-loader 多进程打包（推荐）

- 每个工作程序都是一个单独的node.js进程，其开销约为600毫秒。进程间通信也有开销。
- 仅在耗时的 loader 上使用
- 只要把 thread-loader 放置在其他 loader 之前， 那 thread-loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行
- thread-loader 放在了 style-loader 之后，这是因为 thread-loader 后的 loader 没法存取文件也没法获取 webpack 的选项设置

``` JS
const threadLoader = require('thread-loader');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          'thread-loader',
          // your expensive loader (e.g babel-loader)
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve('src'),
        use: [
          'style-loader'
          'thread-loader',
          // your expensive loader (e.g babel-loader)
        ],
      },
    ],
  },
};
```

- 为防止引导工作程序时出现高延迟，可以预热工作程序池。这将引导池中的最大工作程序数量，并将指定的模块加载到 node.js 模块高速缓存中。

``` JS
const threadLoader = require('thread-loader');

threadLoader.warmup(
  {
    // pool options, like passed to loader options
    // must match loader options to boot the correct pool
  },
  [
    // modules to load
    // can be any module, i. e.
    'babel-loader',
    'babel-preset-es2015',
    'sass-loader',
  ]
);
```


## webpack-parallel-uglify-plugin 多进程压缩js

- webpack 内置 Uglify 工具压缩js
- js单线程，开启多进程压缩更快
- 和happyPack同理

``` JS
const webpack = require('webpack')
const { smart } = require('webpack-merge')
const HappyPack = require('happypack')
const webpackCommonConf = require('./webpack.common.js')
const { srcPath, distPath } = require('./paths')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

module.exports = smart(webpackCommonConf, {
    mode: 'production',
    output: {
        // filename: 'bundle.[contenthash:8].js',  // 打包代码时，加上 hash 戳
        filename: '[name].[contenthash:8].js', // name 即多入口时 entry 的 key
        path: distPath,
        // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
    },
    module: {
        rules: [
            // js
            {
                test: /\.js$/,
                // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
                use: ['happypack/loader?id=babel'],
                include: srcPath,
                // exclude: /node_modules/
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            // window.ENV = 'production'
            ENV: JSON.stringify('production')
        }),
        // happyPack 开启多进程打包
        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'babel',
            // 如何处理 .js 文件，用法和 Loader 配置中一样
            loaders: ['babel-loader?cacheDirectory']
        }),
        // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
        new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的参数
            // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
            uglifyJS: {
                output: {
                    beautify: false, // 最紧凑的输出
                    comments: false, // 删除所有的注释
                },
                compress: {
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                }
            }
        })
    ],
})
```

## terser-webpack-plugin 压缩代码（推荐）

- webpack4 版本后内置的 js 压缩工具
- parallel 开启并行编译（开启多进程）,并发运行的默认数量为 `os.cpus().length - 1`

``` JS
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
};
```


## noParse

``` JS
const { smart } = require('webpack-merge')
const webpackCommonConf = require('./webpack.common.js')
const { srcPath, distPath } = require('./paths')

module.exports = smart(webpackCommonConf, {
    mode: 'production',
    output: {
        // filename: 'bundle.[contenthash:8].js',  // 打包代码时，加上 hash 戳
        filename: '[name].[contenthash:8].js', // name 即多入口时 entry 的 key
        path: distPath,
        // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
    },
    module: {
        rules: [
            // 完整的 react.min.js 文件就没有采用模块化
            // 忽略对 min.js 文件的递归解析
            noParse: [/\.min\.js$/],
        ]
    },
    
})
```

## IgnorePlugin

``` JS
const webpack = require('webpack')
const { smart } = require('webpack-merge')
const webpackCommonConf = require('./webpack.common.js')

module.exports = smart(webpackCommonConf, {
    mode: 'production',
    plugins:[
        // 忽略 moment 下的 /locale 目录
        new webpack.IgnorePlugin(/\.\/locale/, /moment/) // 性能优化：忽略编译配置
    ]
})
```

## noParse vs IgnorePlugin

- IgnorePlugin 是直接不引入，代码中没有，需要什么自己引，**可以减少产出体积**
- noParse 引入，但是不打包，不进行编译，不进行模块化分析

## cache-loader

- 仅仅需要在一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里，显著提升二次构建速度
- 保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader

``` JS
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src')
      }
    ]
  }
}
```

## mode production

- 自动开启压缩
- Vue React 等会自动删除调试代码（如开发环境的 warning ）
- 自动启用 Tree-Shaking
  - Tree-Shaking：需要配合 ES6 Module 才能生效，静态分析代码引入删除无用代码

``` JS
module.exports = {
  mode: 'production'
}
```

## webpack-bundle-analyzer 分析包内容

- Webpack插件和CLI实用程序，将捆绑包内容表示为方便的交互式可缩放树形图

``` JS
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

## speed-measure-webpack-plugin 计算打包时间

``` JS
const webpack = require('webpack')
const { smart } = require('webpack-merge')
const webpackCommonConf = require('./webpack.common.js')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin") // 计算打包时间
const smp = new SpeedMeasurePlugin()

module.exports = smp.wrap(smart(webpackCommonConf, {
    mode: 'production',
    plugins:[
        // 忽略 moment 下的 /locale 目录
        new webpack.IgnorePlugin(/\.\/locale/, /moment/) // 性能优化：忽略编译配置
    ]
})) 
```


## Scope Hosting

- 合并多个函数，减少作用域
- 代码体积更小
- 创建函数作用域更少
- 代码可读性更好

``` JS
const { smart } = require('webpack-merge')
const webpackCommonConf = require('./webpack.common.js')
const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin")

module.exports = smart(webpackCommonConf, {
    mode: 'production',
    resolve: {
        // 针对 NPM 中的第三方模块优先采用 jsnext:main 中指向 ES6 模块化语法的文件
        mainFields: ['jsnext:main', 'browser', 'main']
    },
    plugins: [
        // 开启 Scope Hosting
        new ModuleConcatenationPlugin(),
    ],  
})
```
## 前端为何要进行打包和构建

和代码方面
- 体积更小（Tree-Shaking、压缩、合并），加载更快
- 编译高级语言或语法（TS、ES6、模块化、scss）
- 兼容性和错误检测（polyfill、postcss、eslint）

研发成本
- 统一、高效的开发环境
- 统一的构建流程和产出标准
- 集成公司构建规范（提测、上线等）

## module chunk bundle 的区别

- module-各个源码文件，webpack中一切皆模块
- chunk-多模块合并成的，如 entry import() splitChunk
- bundle-最终的输出文件

## loader 和 plugin的区别

- loader是模块装换器，如less=>css
- plugin扩展插件，如HtmlWebpackPlugin

## 常见loader和plugin

-  [常见loader](https://www.webpackjs.com/loaders/)
-  [常见plugin](https://www.webpackjs.com/plugins/)

## babel 和 webpack 区别

- babel-js新语法编译工具，不关心模块化
- webpack-打包构建工具，是多个 loader 和 plugin 的集合 

## 如何产出一个lib

参考 webpack.dll.js

```js
module.exports = {
    output:{
        // lib 的文件名
        filename: 'lodash.js',
        // 输出 lib 到dist下
        path: '/dist',
        // lib 的全局变量名
        library: 'lodash'
    }
}
```

## babel-polyfill 和 babel-runtime 区别

- babel-polyfill 会污染全局
- babel-runtime 不会污染全局
- 产出第三方lib要用babel-runtime 

## webpack如何实现异步加载

- import()
- 结合 vue 和 react 异步组件
- 结合 vue-router 和 react-router 的异步路由

## proxy 为什么不能被 polyfill

- proxy这个功能无法模拟，无法用Object.defineProperty模拟
- class可以通过function模拟
- promise可以用callback模拟

## webpack有哪些常见性能优化手段

可用于生产环境的
- IgnorePlugin 忽略编译
- 优化babel-loader，配置缓存和限定编译范围
- happyPack 开启多线程编译，推荐使用 thread-loader 代替
- noParse 不解析
- parallelUglifyPlugin 启用多进程压缩代码，开多进程也需要消耗性能，所以按需使用，推荐使用 terser-webpack-plugin 配置 parallel=true 开启多进程

不可用于生产环境的
- 自动刷新
- 热更新
- DllPlugin

优化产出代码
- 小图片base64编码
- bundle加hash
- 懒加载
- 提取公共代码
- 使用cdn加速
- IgnorePlugin
- 使用production
- scope hosting

## babel

### babel
- 只解析语法，不关心api，语法符合规范就不管
- 不处理模块化（webpack配合）
- 引入 babel-poylfill 进行补丁

### babel-poylfill(被弃用)

- 集成了`core-js` 和 `regenerator.js` 
- babel7.4 推荐直接使用 `core-js` `regenerator.js` 
- 文件较大
- 按需引入

```js
// 按需引入
// .babelrc
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage", // 按需引入配置
                "corejs": 3
            }
        ]
    ],
    "plugins": []
}
```

**poylfill补丁问题：污染全局变量**


### babel-runtime

解决poylfill补丁污染全局环境问题，无副作用

- babel-runtime、@balel/plugin-transform-runtime

```js
// .babelrc
{
   "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage", // 按需引入配置
                "corejs": 3
            }
        ]
    ],
    "plugins": [
        // babel-runtime 配置
        "@balel/plugin-transform-runtime",
        {
            "absolutRuntime": false,
            "corejs": 3,
            "helpers": true,
            "regenerator": true,
            "useESModules": false
        }
    ] 
}
```
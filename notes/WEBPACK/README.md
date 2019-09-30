# webpack 性能优化
## 减少打包时间

### 优化loader
#### 优化loader的文件搜索范围
```js
module.exports = {
    module:{
        rules:[
            {
                // js文件才使用babel
                test:/\.js$/,
                // 缓存编译过的文件
                loader:"babel-loader?cacheDirectory=true",
                // 只有src文件夹下查找
                include:[resolve('src')],
                // 不会去查找的路径
                exclude:/node_modules/
            }
        ]
    }
}
```
### HappyPack
将loader的同步执行转为并行，充分利用系统资源加快打包效率
```js
module.exports = {
    loaders:[
        test:/\.js$/,
        include:[resolve('src')],
        exclued: /node_modules/,
        // id 后面的内容对应下面
        loader:'happypack/loader?id=happybabel'
    ]
}
plugins:[
    new HappyPack({
        id:'happypack',
        loaders:['babel-loader?cacheDirectory'],
        // 开启4个线程
        threads:4
    })
]
```
### DllPlugin
DllPlugin可以将特定的类库提前打包然后引入，这种方式可以极大的减少打包类库的次数，只有当类库更新版本才有需要重新打包，并且也实现了将公用代码抽离成单独文件的优化方案

```js
// 单独配置在一个文件中
// webpack.dll.conf.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry:{
        // 想统一打包的类库
        vendor:['react']
    },
    output:{
        path:path.join(__dirname,'dist'),
        filename:'[name].dll.js',
        library:'[name].[hash]'
    },
    plugins:[
        new webpack.DllPlugin({
            // name必须和output.library一致
            name:'[name].[hash]',
            // 该属性需要与DllReferencePlugin 中一致
            context:__dirname,
            path:path.join(__dirname,'dis','[name]-manifest.json')
        })
    ]
}
```
执行这个配置并生成依赖文件  
使用DllReferencePlugin将依赖文件引入项目中

```js
// webpack.conf.js
module.exports = {
    plugins:[
        new webpack.DllReferencePlugin({
            context:__dirname,
            // manifest 就是之前打包出来的json文件
            manifest:require('./dist/vendor-manifest.json')
        })
    ]
}
```

## 减少webpack打包后的文件体积
### Scope Hoisting（范围提升）
Scope Hoisting 会分析出模块之间的依赖关系，尽可能的把打包出来的模块合并到一个函数中去，在webpack4中要开启该功能只需启用optimization.concatenateModules
```js
module.exports = {
    // 最优化
    optimization:{
        // 连接模块
        concatenateMdoules:true
    }
}
```

### Tree Shaking
Tree Shacking 可以实现删除项目中未被引用的代码，webpack4中开启生成环境会自动开启这个功能
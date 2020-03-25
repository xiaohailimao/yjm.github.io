---
title: Nodejs
date: 2020-01-01
tags:
 - Nodejs
categories:
 -  文章
---

## require 特性
1. module被加载的时候执行，加载后缓存
2. 一旦出现某模块被循环加载，就只输出已执行的部分，还未执行的不会输出

## exports

```js
// 1. 一个文件就是一个模块，一个文件只能有一个模块
// 2. const exports = module.exports exports指向module.exports当做快捷键
// 3. module 就是指向模块对象，module包含exports及其他属性

(
    function (exports,require,module,__filename,__dirname){
        // code
    }
)()
// 快捷方式
exports.a = 1

// 修改指向，不在生效
exports = {
    a:1
}
```
## global
在global对象中添加属性会被挂载到全局中

## process 进程
1. argv 
执行命令的环境参数数组，从第三位开始是自定义传入的参数
```js
process.argv
// argv: [
//     '/usr/local/bin/node',
//     '/Users/****/Desktop/nodejs'
//   ]
```
2. cwd()
获取当前执行文件路径
```js
process.cwd() // /Users/****/Desktop/nodejs

```
3. setImmediate() (推荐) 
下个事件队列执行，等同步事件执行完后在执行，与时间无关，放到了下个队列的队首
```js
setImmediate(()=>{
    console.log('setImmediate')
})
```
4. nextTick() 
与setImmediate类似，比setImmediate执行的早，放到了但前队列的最后一个，长时间调用会导致其他异步无法执行
```js
setImmediate(()=>{
    console.log('setImmediate')
})
setTimeout(()=>{
    console.log('Timeout')
},0)
process.nextTick(()=>{
    console.log('nextTick')
    process.nextTick(()=>{
        console.log('nextTick1')
    })
})

// nextTick
// nextTick1
// Timeout
// setImmediate

```
## path
```js
const { normalize, join, resolve, basename, extname, dirname, parse, format } = require('path')
```
1. normalize 处理路径，修复异常写法的路径
2. join 拼接路径，并会修复异常写法的路径
3. resolve 解析成绝对路径
4. basename 返回路径最后一部分内容
5. extname 返回文件扩展名
6. dirname 返回目录名称
7. format 将对象返回路径字符串
```js
format({
    root:"",
    dir:"",
    base:"",
    name:"",
    ext:""
})
```
8. parse 将路径解析成对象
```js
const path =  "/Users/******/Desktop/学习/nodejs"
parse(path)
// {
//   root: '/',
//   dir: '/Users/******/Desktop/学习',
//   base: 'nodejs',
//   ext: '',
//   name: 'nodejs'
// }
```

9. __dirname,__filename 总是返回文件的绝对路径
10. process.cwd() 总是返回执行node命令所在的文件路径
11. require() 总是相对当前文件所在文件夹

## Buffer
1. 用于处理二进制数据流
2. 实例类似于整数数组，大小固定
3. C++代码在V8堆外分配物理内存

4. Buffer.byteLength()
5. Buffer.isBuffer()
6. Buffer.concat()

Buffer实例属性
7. buf.length
8. buf.toString()
9. buf.fill()
10. buf.equals()
11. buf.indexOf()
12. buf.copy()

13. StringDecoder 乱码处理

## events

## fs
1. 所有回调函数的第一个参数都是保留给异常，如果操作成功则第一个参数会是null或者undefined
2. fs.readFile()
3. fs.writeFile()
4. 尽量不用同步操作，在高并发的时候会影响性能
5. fs.unlink(path, callback) 删除文件
6. fs.watch()
# 其他

## Chrome 截屏
- Ctrl + Shift + P: 打开Command菜单
- 截图：在Command菜单中输入screen，可选择Capture node screenshot(节点截屏)、Capture full size screenshot(全屏截屏)、Capture screenshot(可视窗口截屏)，图片会直接下载到本地
## console.dir 打印dom节点
## console.log({...object}) 增强 log 的阅读体验增强 log 的阅读体验
## console.assert
当我们传入的第一个参数为 假 时，console.assert 打印跟在这个参数后面的值。
```js
console.assert(assertion, obj1 [, obj2, ..., objN]);
console.assert(assertion, msg [, subst1, ..., substN]); // c-like message formatting
```
## 重新发送XHR的请求
network=>右击=>Replay XHR

## mac终端下运行shell脚本
1、写好自己的 脚本，比如test.sh 
 
2、打开终端 执行，方法一： 输入命令    `./test.sh`
 
方法二：直接把 test.sh 拖入到终端里面。
 
注意事项：
 
如果 没有成功报出问题：: 
 
`Permission denied。`就是没有权限。
 
解决办法：
 
修改该文件test.sh 的权限 ：使用命令： 

```sh
chmod 777 test.sh
```
 
然后再执行 上面第二步的操作


## 前端监控系统
- `ARMS` 产品提供一系列监控定制功能，包括数据接入、数据计算、数据存储、大盘展示和报警，以及下游 API 对接等环节。
- 错误追踪服务 [Sentry](https://sentry.io/) 和 [Bugsnag](https://docs.bugsnag.com/platforms/browsers/vue/) 

## npm 包部署
1. [注册npm账号](https://www.npmjs.com/signup)
2. 检测npm包名是否重复
```sh
npm view [name]
```
未被占用则返回404，已被占用则会返回该npm包相关信息

3. package.json
```json
{
    "name": "",
    "version": "1.0.0",
    "description": "",
    "keywords": [],
    "main": "dist/**.umd.js",
    "module": "dist/**.es5.js",
    "typings": "dist/**.d.ts",
    "files": [
        "dist"
    ],
    "author": "",
    "repository": {
        "type": "git",
        "url": ""
    },
    "license": "MIT",
}
```
4. 发布npm包
```sh
# login
npm login
# publish
npm version [versionValue] --message '[release] $VERSION' 
npm publish
```
5. 自动部署
```sh
#!/usr/bin/env sh
set -e
echo "Enter release version: "
read VERSION
read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo # (optional) move to a new line
if [[$REPLY =~ ^[Yy]$]]
then 
    echo "Releasing $VERSION ..."
    # commit
    git add -A
    git commit -m "[build] $VERSION"
    npm version $VERSION --message "[release] $VERSION"
    git push origin master

    # publish
    npm publish
fi
```

## npm / yarn origin管理
临时修改
```sh
# npm
npm i [name] --registry https://r.cnpmjs.org
# yarn
yarn add [name] --registry https://r.cnpmjs.org
```
管理插件
```sh
# npm
npm i -g nrm
# yarn
npm i -g yrm
```
查看地址
```sh
# npm
nrm ls
# yarn
yrm ls
# origin
* npm ---- https://registry.npmjs.org/
  cnpm --- http://r.cnpmjs.org/
  taobao - https://registry.npm.taobao.org/
  nj ----- https://registry.nodejitsu.com/
  rednpm - http://registry.mirror.cqupt.edu.cn/
  npmMirror  https://skimdb.npmjs.com/registry/
  edunpm - http://registry.enpmjs.org/
  yarn --- https://registry.yarnpkg.com
```
测试地址响应情况
```sh
# npm
nrm test
# yarn
yrm test

# response
* npm ---- 1809ms
  cnpm --- 1012ms
  taobao - 1232ms
  nj ----- Fetch Error
  rednpm - Fetch Error
  npmMirror  2122ms
  edunpm - Fetch Error
  yarn --- Fetch Error
```

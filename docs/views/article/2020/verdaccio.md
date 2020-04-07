---
title: verdaccio私有npm仓库搭建
date: 2018-01-02
tags:
 - 工具
categories:
 -  文章
---

## 服务器搭建（CentOS）
使用yum安装nodejs
1. 获取最新版bash
```sh
curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
```
其他版本
```sh
curl --silent --location https://rpm.nodesource.com/setup_7.x | bash -
```
2. 执行安装
```sh
sudo yum install -y nodejs
```
3. 查看版本
```sh
node -v
npm -v
```
## 安装verdaccio
安装
```sh
npm install -g verdaccio
```
启动
```sh
verdaccio
```
执行结果如下：
```sh
Verdaccio doesn't need superuser privileges. Don't run it under root.
 warn --- config file  - /root/.config/verdaccio/config.yaml
 warn --- Plugin successfully loaded: htpasswd
 warn --- Plugin successfully loaded: audit
 warn --- http address - http://localhost:4873/ - verdaccio/4.2.2
```
## 配置verdaccio
```sh
# 进入verdaccio目录
cd /root/.config/verdaccio/

# 查看该目录下的文件，该目录下默认有两个文件：config.yaml和storage，添加用户之后会自动创建htpasswd
ls
> config.yaml  storage

# 查看配置文件
vim config.yaml
```
在配置文件config.yaml末尾加入代码：
```sh
# you can specify listen address (or simply a port)
listen: 0.0.0.0:4873
```
## pm2
使用pm2启动verdaccio，保证进程一直处于打开状态
安装pm2
```sh
npm install -g pm2
```
使用pm2启动verdaccio
```sh
pm2 start verdaccio
```
## 访问私有仓库
```sh
http://localhost:4873
# or
http:ip:4873
```
::: warning 注意
在阿里云服务器添加安全组，开放 4873 端口号，如果没有添加该端口安全组则不能在浏览器正常访问http://ip:4873

ip=>服务器ip地址/域名地址
:::

## 发布npm包到私有仓库
1. 登录
```sh
npm login
```
2. 发布
```sh
npm publish --registry http://47.107.67.231:4873
```
3. 下架
```sh
npm unpublish name@x.x.x --registry http://47.107.67.231:4873
```
## 私有仓库web界面访问
```
http://47.107.67.231:4873
```
## 临时使用npm私有仓库
```sh
npm install vue --registry http://47.107.67.231:4873
```
## npm地址管理
1. 安装npm地址管理插件
```sh
npm install -g nrm
# or
npm add -g yrm
```
2. 添加npm地址
```sh
nrm add ylz http://47.107.67.231:4873
# or
yrm add ylz http://47.107.67.231:4873
```
3. 查看地址
```sh
nrm ls
# or 
yrm ls
# 输入内容
  npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
  taobao ----- https://registry.npm.taobao.org/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/
* ylz -------- http://47.107.67.231:4873/
```
4. 使用私有仓库地址
```sh
nrm use ylz
# or
yrm use ylz
```
## .npmrc 配置
除了安装时通过命令修改安装配置，还可以通过修改.npmrc这个配置文件修改工程配置
```sh
# npm请求地址配置
registry=https://xxxx
# 私有包请求地址配置
@custom:registry=http://xxxx
```
::: tip 提示
[verdaccio 文档](https://verdaccio.org/)
:::

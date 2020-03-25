---
title: centos7 frp安装和配置
date: 2020-03-22
tags:
 - 工具
categories:
 -  文章
---

## 解压包
```sh
tar -zxvf frp_0.32.0_linux_386.tar.gz
```
## 进入文件目录
```sh
cd ~
cd frp_0.32.0_linux_386
```
1. frps.ini: 服务端配置文件
2. frps: 服务端软件
3. frpc.ini: 客户端配置文件
4. frpc: 客户端软件

## 启动服务
```sh
./frps -c ./frps.ini
```
## 不挂断运行nohup启动
```sh
nohup ./frps -c ./frps.ini &     #启动服务端 带&符号
```
## 关闭
```sh
kill 19619                     #输入你系统中返回的pid
```
## 查看状态
```sh
netstat -antpl 
```
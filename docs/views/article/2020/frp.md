---
title: CentOS7 frp 安装和配置
date: 2020-03-22
tags:
 - 工具
categories:
 -  文章
---

快速反向代理，可帮助您将NAT或防火墙后面的本地服务器公开到Internet

## 下载资源包

```sh
wget https://github.com/fatedier/frp/releases/download/v0.32.0/frp_0.32.0_linux_386.tar.gz
```

::: tip 提示
[frp github 项目地址](https://github.com/fatedier/frp)
:::

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

## frpc 本地应用配置

```sh
# frpc.ini
[common]
server_addr = x.x.x.x
server_port = 7000

[web]
type = tcp
local_ip = 127.0.0.1
local_port = 8080
remote_port = 7001
```

::: warning 注意
服务器需要开放对应端口
:::

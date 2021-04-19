---
title: vscode sftp
date: 2019-12-25
tags:
  - 工具
categories:
  - 文章
---

这里用到 vscode 的一个插件 sftp 增加 vscode 对服务器文件资源对管理

## 配置

```json
{
  "name": "My Server",
  "host": "***",
  "protocol": "sftp",
  "port": 22,
  "username": "root",
  "password": "***",
  "remotePath": "/",
  "uploadOnSave": false
}
```

多服务器配置

```json
[
  {
    "name": "My Server",
    "host": "***",
    "protocol": "sftp",
    "port": 22,
    "username": "root",
    "password": "***",
    "remotePath": "/",
    "uploadOnSave": false
  },
  {
    "name": "My Server",
    "host": "***",
    "protocol": "sftp",
    "port": 22,
    "username": "root",
    "password": "***",
    "remotePath": "/",
    "uploadOnSave": false
  }
]
```

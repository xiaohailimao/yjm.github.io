---
title: 代码风格统一规范
date: 2020-04-15
tags:
 - 工具
categories:
 -  文章
---
## vue cli 插件快速配置
```sh
vue add eslint
```

## prettier 配合 husky 和 lint-staged 使用
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,vue}": [
      "eslint --fix",
      "git add"
    ],
    "*.{md,scss}": [
      "prettier --write",
      "git add"
    ],
  },
}
```
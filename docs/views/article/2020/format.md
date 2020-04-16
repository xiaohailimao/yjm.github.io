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

## vscode 配置 ESLint 自动格式化

```json
{
    // 语言格式化配置
    "[html]": {
        "editor.defaultFormatter": "vscode.html-language-features"
    },
    "[javascript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "[json]": {
        "editor.defaultFormatter": "vscode.json-language-features"
    },
    "[vue]": {
        "editor.defaultFormatter": "octref.vetur"
    },
    "[nginx]": {
        "editor.defaultFormatter": "raynigon.nginx-formatter"
    },
    "[md]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    // eslint配置
    "eslint.format.enable": true,
    // 保存后自动格式化
    "editor.codeActionsOnSave": {
        "source.fixAll": true,
        "source.fixAll.eslint": true
    },
}
```

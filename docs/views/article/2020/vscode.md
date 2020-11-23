---
title: vscode 常用插件
date: 2020-03-29
tags:
 - 工具
categories:
 -  文章
---

## vscode 插件

1. ESLint 格式规范化
2. Chinese language pack for Visual Studio Code 汉化语言包
3. Comment Translate 翻译
4. Dash (mac) 文档查询
5. Beautify 格式化
6. GitLens-Git supercharged git扩展工具
7. Vetur vue code 工具
8. TODO Highlight 待办高亮提示
9. Todo Tree 待办事项目录树
10. Nasc VSCode Tochbar (mac) vscode mac tochbar快捷健扩展功能
11. Debugger for Chrome Chrome浏览器调试工具
12. One Dark Pro 主题
13. Palenight Theme 主题
14. Material Icon Theme 图标
15. vscode-icon 图标
16. markdownlint
17. Prettier-code formatter
17. Bracket Pair Colorizer 括号着色器

## vscode 配置

```json
{
    "npm.enableScriptExplorer": true,
    "files.autoSave": "afterDelay",
    "breadcrumbs.enabled": true,
    // 当js/ts文件移动时自动变更导入路径
    "typescript.updateImportsOnFileMove.enabled": "always",
    "javascript.updateImportsOnFileMove.enabled": "always",
    "explorer.confirmDelete": false,
    "javascript.implicitProjectConfig.experimentalDecorators": true,
    "explorer.confirmDragAndDrop": false,
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
    "editor.renderWhitespace": "none",
    // mac touchbar
    "nasc-touchbar.addCursorBelow": false,
    "nasc-touchbar.showReferences": true,
    "nasc-touchbar.showCommands": false,
    // 工作台配置
    "workbench.colorTheme": "Palenight Theme",
    "workbench.startupEditor": "newUntitledFile",
    "workbench.iconTheme": "material-icon-theme",
    // 语言关联
    "files.associations": {
        "*.vue": "vue"
    },
    // 翻译配置
    "commentTranslate.targetLanguage": "zh-CN",
    "window.zoomLevel": 0,
    "editor.cursorSmoothCaretAnimation": true,
    // eslint配置
    "eslint.format.enable": true,
    // 保存后自动格式化
    "editor.codeActionsOnSave": {
        "source.fixAll": true,
        "source.fixAll.eslint": true
    },
}
```

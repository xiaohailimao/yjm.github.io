---
title: storybook
date: 2021-01-21
tags: 
- 工具
categories: 
- 文章
---

## 简介

Storybook 是一个用于 UI 开发的工具。它通过隔离组件使开发更快、更容易。这允许您一次处理一个组件。您可以开发整个 UI，而无需启动复杂的开发堆栈、将某些数据强加到您的数据库中或浏览您的应用程序。

## 快速安装

使用 Storybook CLI 在单个命令中安装它。在现有项目的根目录中运行：

```BASH
# Add Storybook:
npx sb init
```
*sb init 不适用于空项目*

## create-react-app cli 生成的项目配置 storybook

```JS
// .stroybook/main.js
module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    '@storybook/preset-ant-design',
    {
      "name": "@storybook/preset-create-react-app",
      "options": {
        "craOverrides": {
          "fileLoaderExcludes": ["less"]
        }
      }
    }
  ],
}
```

## umi cli 生成的项目配置 storybook

```JS
// .stroybook/main.js
const path = require('path');

module.exports = {
  stories: [
    '../src/components/**/*.stories.mdx',
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-notes/register',
    '@storybook/addon-notes/register-panel',
    '@storybook/addon-knobs',
  ],
  // less 编译配置
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    });
    return config;
  },
  // antd 样式编译配置
  babel: async (options) => ({
    ...options,
    plugins: [
      [
        'import',
        {
          libraryName: 'antd',
          style: true,
        },
      ],
    ],
  }),
};

```



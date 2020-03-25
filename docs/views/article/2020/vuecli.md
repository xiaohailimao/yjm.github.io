---
title: Vue-CLI
date: 2020-03-16
tags:
 - 工具
categories:
 -  文章
---

## 资源管理

安装资源管理插件

```sh
yarn add filemanager-webpack-plugin -D
```

vue-cli配置

```js
// vue.config.js
const FileManagerPlugin = require("filemanager-webpack-plugin");
module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            //打包
            return {
                plugins: [new FileManagerPlugin({
                    onEnd: {
                        archive: [{
                            source: "./dist",
                            destination: `./[name].zip`
                        }]
                    }
                })]
            };
        }
    },
}
```
## cross-env 环境变量设置
安装跨平台设置环境变量插件

```sh
npm install cross-env -D
```
设置环境变量
```json
// package.json
"scripts": {
    "serve": "cross-env --PROJECT_NAME=A vue-cli-service serve",
  },
```
读取环境变量
```js
process.env.PROJECT_NAME //=> A
```

## 插件配置
babel.config.js

```js
module.exports = {
  presets: ["@vue/app"],
  
  plugins: [
  //element ui
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ],
    //vant ui
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true
      }
    ]
  ]
};

```

##  初始配置文件
配置文件名 `.vuerc` 配置默认包管理器等

## 跨域代理

vue.config.js
```js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        // target: process.env.VUE_APP_BASE,
        target: "http://xxxxx.com",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
}
```

NGINX配置
```sh
# 用/api来访问其他网站的接口，实现跨域
location /api {
    # 下面三个是跨域的一些设置
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
    # Access-Control-Allow-Headers需要注意，会屏蔽一些headers，部署时需要注意
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,X-CSRFTOKEN';
    proxy_pass http://xxxx.com;
}
```

## git提交规范控制配置
### commit message 格式
type 提交类型
```sh
? Select the type of change that you're committing: (Use arrow keys)
> feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
  build:    Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  ci:       Changes to our CI configuration files and scripts (example scopes:  Travis, Circle, BrowserStack, SauceLabs)
  chore:    Other changes that don't modify src or test files
  revert:   Reverts a previous commit
(Move up and down to reveal more choices)
```
scope 影响范围
```sh
What is the scope of this change (e.g. component or file name): (press enter to skip)
```
short description 简短描述
```sh
Write a short, imperative tense description of the change (max 95 chars):
```
longer description 详细描述
```sh
Provide a longer description of the change: (press enter to skip)
```
breaking 冲突 
```sh
Are there any breaking changes? (y/N)
# y
? Are there any breaking changes? Yes
? Describe the breaking changes:
```
issues 问题
```sh
Does this change affect any open issues? (y/N)
# y
? Does this change affect any open issues? Yes
? Add issue references (e.g. "fix #123", "re #123".):
```
### script

提交message
```sh
npm run commit
```
生成CHANGELOG
```sh
npm run changelog
```

### package
```json
{
  "scripts": {
    "commit": "git-cz",
    "precommit": "lint-staged",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -w -r 0"
  },
  "lint-staged": {
    "src/**/*.{js,vue}": [
      "prettier --write",
      "git add"
    ]
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  },
   "devDependencies": {
    "conventional-changelog-cli": "^2.0.23",
    "cz-conventional-changelog": "3.0.2",
    "lint-staged": "^9.2.5",
    "commitizen": "^4.0.3",
  },
}
```

## vant 自适应配置
1. 安装postcss-pxtorem
```sh
yarn add postcss-pxtorem -D
```
2. 配置postcss.config.js

postcss-pxtorem会忽略Px大写的单位
```js
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
```
3. 根元素字体设置

rem.scss
```scss
// rem 单位换算：定为 75px 只是方便运算，750px-75px、640-64px、1080px-108px，如此类推
$vw_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function px2rem($px) {
     @return ($px / $vw_fontsize) * 1rem;
}
html {
    font-size: 10vw; 
    // 同时，通过Media Queries 限制根元素最大最小值
    // postcss-pxtorem会忽略Px大写的单位
    @media screen and (max-width: 320Px) {
        font-size: 32Px;
    }
    @media screen and (min-width: 540Px) {
        font-size: 54Px;
    }
}
body{
  font-size: px2rem(28);
}
```
4. 向预处理器 Loader 传递选项
```js
module.exports = {
  css: {
    loaderOptions: {
      scss: {
        data: `@import "~@/rem.scss";`
      }
    }
  }
}
```
5. 样式

```scss
@import "@/rem.scss"; // 如果vue.config.js 有配置，则不需要引入

.demo{
  // 750px基准设计尺寸使用px2rem()转换
  width: px2rem(400); //=>5.3333333333rem,200px(375)
  // 375px基准设计尺寸使用px
  // px值会被postcss-pxtorem 转换成rem
  height: 200px; //=>5.33333rem,199.984px(375),220.797px(414)
  padding: 50Px; //=>50px,大写单位会被postcss-pxtorem忽略
}
```

## 向预处理器 Loader 传递选项
@vue/cli 3+
```js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/assets/css/var.scss";`
      }
    }
  }
};
```
@vue/cli 4+
```js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        //  @vue/cli 4.0 data=>prependData
        prependData: `@import "~@/assets/css/var.scss";`
      }
    }
  }
};
```


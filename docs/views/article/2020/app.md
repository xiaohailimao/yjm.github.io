---
title: 移动端自适应适配
date: 2020-04-04
tags:
 - 工具
categories:
 -  文章
---

## vm+rem

通过设置根节点的字体大小（vm 屏幕宽度单位，字体大小跟着屏幕宽度变化），在配合rem完成移动端自适应适配

preset.scss
```scss
// iPhone6 尺寸的根元素大小基准值37.5
// 像素倍数关系，1倍像素基准值37.5，2倍像素素基准值75，3倍像素素基准值112.5
$vm_ratio:1;

html {
    // 根元素大小使用vw单位
    font-size: $vm_ratio * 10vw;

    // 通过media 查询限制根元素最大最小值
    @media screen and (max-width: 320Px) {
        font-size: 32Px * $vm_ratio;
    }

    @media screen and (min-width:540Px) {
        font-size: 54Px * $vm_ratio;
    }
}

// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小
body {
    // max-width:540Px;
    min-width: 320Px;
}
```

## posstcss-pxtorem
将px转换成rem
1. Px/PX 将会被忽略
3. rootValue 要与css中根节点计算基准值一致


postcss.config.js
```js
module.exports = {
  plugins: {
    'autoprefixer': {},
    'postcss-pxtorem': {
      rootValue:37.5, // 像素倍数关系，1倍像素基准值37.5，2倍像素素基准值75，3倍像素素基准值112.5
      propList: ['*'],
    }
  }
}
```

::: tip 提示
1. 当使用该方案进行`px=>rem`转换，无需改变原来css写法
2. 例如设计图是iPhone6为基准的375宽度，在css编写样式时可以直接使用设计图中标注的样式尺寸。
3. 如果设计图是以2倍像素750宽度设计的话则需要配置如下，用法如上。
```scss
// preset.scss
// ...
$vm_ratio:2; // 2倍像素比率
// ...
```

```js
// postcss.config.js
module.exports = {
  plugins: {
    'autoprefixer': {},
    'postcss-pxtorem': {
      rootValue:75, // 2倍像素素基准值75
      propList: ['*'],
    }
  }
}
```
:::

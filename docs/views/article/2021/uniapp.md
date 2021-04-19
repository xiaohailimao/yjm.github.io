---
title: uniApp
date: 2020-05-17
tags: 
- Vue
categories: 
- 文章
---

## 常见问题

### uniapp webview 外嵌页面加 tabbar 导致 tabbar 遮盖底部区域

给 `webview` 包一层 `view`，其他样式错位也是一样需要放在一个`view`中

```html
<template>
  <view>
    <web-view src="url"></web-view>
  </view>
</template>
```

### uniapp webview 外嵌页面动态修改标题

```html
<template>
  <view>
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: "",
    };
  },
  onLoad(e) {
    // 获取传递过来的链接
    this.url = e.url;
    // 获取传递进来嵌入页面标题
    e.title && uni.setNavigationBarTitle({
      title: e.title
    });

  },
};
</script>
```


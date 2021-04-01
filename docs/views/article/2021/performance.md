---
title: 性能优化
date: 2021-03-31
tags: 
- 性能优化
categories: 
- 文章
---

# 性能优化

## 网络

### webpack

1. 缓存：`babel-loader?cacheDirectory=true`
2. 开启多进程: `happypack`
3. 排除第三方插件，减少重复打包: `DllPlugin`
4. 减少loader内容：`include | exclude` 
5. 分析文件结构，优化体积过大文件: `webpack-bundle-analyzer`
6. 删除冗余代码: `Tree-Shaking`
7. 按需加载: `require.ensure(dependencies, callback, chunkName)`
8. Gzip

### 图片优化

1. jpg/jpeg：有损压缩、体积小、不支持透明背景、适合banner图
2. png：无损压缩、体积大、支持透明背景、适用logo图
3. svg：文本文件、矢量图、体积小、不失真、兼容好、渲染成本比较高
4. base64：文本文件、依赖编码、小图标解决方案、补充雪碧图存在、适用小图标
5. webp：全能、兼容不好

## 储存

## 渲染

## 应用

## 性能监控
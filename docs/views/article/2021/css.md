---
title: css知识点
date: 2021-01-26
tags: 
- 理论
categories: 
- 文章
---

## 标准的 CSS 的盒子模型？低版本 IE 的盒子模型有什么不同的？

- 盒模型组成：content、boder、padding、margin
- 标准盒模型：width 和 height 只包含 content
- IE盒模型：width 和 height 包含 content、padding、border的内容
- 可以通过border-box切换盒模型
  - border-box：content-box 标准盒模型
  - border-box：border-box IE盒模型

## CSS 选择符有哪些？

- id选择器（`#id`）
- class选择器（`.className`）
- tag选择（`div，p`）
- 后代选择器（`div p`）
- 子选择器（`div>a`）
- 兄弟选择器（`li~a`）
- 相邻兄弟选择器（`li+a`）
- 属性选择器（`a[rel='external']`）
- 伪类选择器（`a:hover,li:nth-child`）
- 伪元素选择器（`::before, ::after`）
- 通配符选择器（`*`）

## ::before 和:after 中双冒号和单冒号有什么区别？解释一下这 2 个伪元素的作用


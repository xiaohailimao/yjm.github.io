---
title: 常用正则校验
date: 2020-03-28
tags: 
- 工具
categories: 
- 文章
---

## 手机号正则规则

### 2021三大运营商最新号段

#### 移动号段：

```
134 135 136 137 138 139 147 148 150 151 152 157 158 159 172 178 182 183 184 187 188 195 198
```

#### 联通号段：

```
130 131 132 145 146 155 156 166 167 171 175 176 185 186 196
```

#### 电信号段：

```
133 149 153 173 174 177 180 181 189 191 193 199
```
#### 虚拟运营商:

```
162 165 167 170 171
```

### 正则

```
/^(13[0-9]|14[56789]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[136589])\d{8}$/
```

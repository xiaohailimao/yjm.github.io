---
title: Event Loop
date: 2020-03-16
tags:
 - JavaScript
categories:
 -  文章
---

## 线程与进程

进程>线程：一个进程可以有多个线程
进程描述了 CPU 在运行指令及加载和保存上下文所需的时间，放在应用上来说就代表了一个程序。线程是进程中的更小单位，描述了执行一段指令所需的时间。

JS单线程的好处：

- 节省内存
- 节约上下文切换时间
- 没有锁的问题

## 执行栈

`先进后出原则`，可以认为是一个存储函数调用的栈结构。
栈可存放的函数是有限的，当我们试用递归的时候可能存放过多的函数且没有得到释放，就会出现爆栈的问题（Maxium call stack size exceeded）

## 浏览器中的Event Loop

当遇到异步的代码时，会被`挂起`并在需要执行的时候加入到 Task（有多种 Task） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为。

Event Loop执行顺序

- 首先执行同步代码，这属于宏任务
- 当所以同步任务执行完后，执行栈为空，查询是否有异步代码需要执行
- 执行所有微任务
- 当执行完所有微任务后，有必要时会渲染页面
- 然后执行下一轮Event Loop，执行宏任务中的异步代码

宏任务：script,setTimeout,setInteral,setImmediate,I/O,UI,rendering  
微任务：process.nextTick（node独有）,promise,MutiationObserver

```js
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
// script start => async2 end => Promise => script end => promise1 => promise2 => async1 end => setTimeout
```

---
title: Event Loop
date: 2020-08-16
tags:
 - JavaScript
categories:
 -  文章
---

## 什么事事件循环

- 是使用异步的原理
- 因为 js 是单线程运行的，在代码执行的时候，通过将不同函数的执行上下文压入执行栈中来保证代码的有序执行。在执行同步代码的时候，如果遇到了异步事件，js 引擎并不会一直等待其返回结果，而是会将这个事件挂起，继续执行执行栈中的其他任务。当异步事件执行完毕后，再将异步事件对应的回调加入到与当前执行栈中不同的另一个任务队列中等待执行。任务队列可以分为宏任务对列和微任务对列，当当前执行栈中的事件执行完毕后，js 引擎首先会判断微任务对列中是否有任务可以执行，如果有就将微任务队首的事件压入栈中执行。当微任务对列中的任务都执行完成后再去判断宏任务对列中的任务。

## 线程与进程

- 进程>线程：一个进程可以有多个线程
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

- 宏任务：script,setTimeout,setInteral,setImmediate,I/O,UI,rendering  
- 微任务：process.nextTick（node独有）,promise,对 Dom 变化监听的 MutationObserver

Event Loop执行顺序

- 首先执行同步代码，这属于宏任务
- 当所以同步任务执行完后，执行栈为空，查询是否有异步代码需要执行
- 执行所有微任务
- 当执行完所有微任务后，有必要时会渲染页面
- 然后执行下一轮Event Loop，执行宏任务中的异步代码

优先级

- setTimeout = setInterval 一个队列
- setTimeout > setImmediate
- process.nextTick > async/await > Promise

```js
console.log('1 script start')

async function async1() {
  await async2()
  await async3()
  console.log('8 async1 end')
}

async function async2() {
  console.log('2 async2 end')
}

async function async3(){
  console.log('6 async3 end');
}

async1()

setTimeout(function() {
  console.log('10 setTimeout')
}, 0)

new Promise(resolve => {
  console.log('3 Promise')
  resolve()
})
  .then(function() {
    console.log('7 promise1')
  })
  .then(function() {
    console.log('9 promise2')
  })

process.nextTick(()=>{
  console.log('5 nextTick')
})

console.log('4 script end')

// 1 script start
// 2 async2 end
// 3 Promise
// 4 script end
// 5 nextTick
// 6 async3 end
// 7 promise1
// 8 async1 end
// 9 promise2
// 10 setTimeout
```

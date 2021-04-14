---
title: Typescript
date: 2021-04-01
tags: 
- JavaScript
categories: 
- 文章
---

# typescript基础知识

## 基础
### 原始类型

`Number` 、 `Boolean` 、 `String` 、 `Null` 、 `Undefined` 、 `Symbol` 、 `BigInt`

### 基础类型定义

变量名后加冒号 `:`

``` js
let a: string = 'str'
let b: number = 1
```

### 联合类型定义

变量名后加冒号 `:` ，多个类型用 `|` 隔开  

``` js
let a: string | number = 'str'
```

### 任意类型定义

变量名后加冒号 `:` ，类型值为 `any` , 声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值

```js 
let a : any = 'str'
a = 1
a = false

``` 

### 类型推论

如果定义变量时未给类型定义，会根据定义时赋值类型做类型推论，如果定义变量时未赋值，则推论为 `any` 类型

``` JS
let a = 'a' // 推论为string类型
let a // 推论为any类型
```

### 对象的类型-接口

``` js
// 基础接口定义
interface Preson {
  name: string;
  age: number;
  readonly id: string; // 只读属性，只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候
  sex ? : string; // 可选属性
  [propName: string]: any; // 任意属性
}
```

定义的变量比接口少了一些属性是不允许的，多一些属性也是不允许的

### 数组的类型

#### 基础方法使用就是 类型+方括号

``` js
let arr: number[] = [1, 2, 3]
```

数组的项目中不允许出现其他类型

``` js
let arr: number[] = [1, '2', 3]
// Type 'string' is not assignable to type 'number'.
```

#### 数组泛型 `Array<number>`

``` JS
let arr: Array < number > = [1, 2, 3]
```

#### 接口表示数组

``` JS
interface NumberArray {
  [index: number]: number;
}

let arr: NumberArray = [1, 2, 3]
```

#### 任意数组

``` JS
let arr: any[] = [1,false,'str']
```

#### 类数组

类数组不是数组类型，例如`arguments`

``` JS
function  sum() {
  let arg: number[] = arguments // argument是类数组会报错
}
// Type 'IArguments' is missing the following properties from type 'number[]': pop, push, concat, join, and 24 more.
```
类数组应该用接口定义

``` JS
function sum(){
  let arg:{
    [index:number]:number;
    length:number;
    callee:Function;
  } = arguments
}
```

事实上常用的类数组都有自己的接口定义，如 `IArguments`, `NodeList`, `HTMLCollection` 等：

``` JS
function sum() {
    let args: IArguments = arguments;
}
```

### 函数类型定义

#### 函数声明

``` JS
function sum (x:number,y:number):number{
  return x + y
}
```

#### 函数表达式

``` JS
// 通过类型推导
let sum = function (x:number,y:number):number{
  return x + y
}
// 手动定义类型
let sum : (x:number,y:number) => number = function (x:number,y:number):number{
  return x + y
}
```

**这里的`=>`和`es6`的箭头函数不要混淆，ts类型定义中的`=>`是用来表示函数定义的，左边是输入类型，需要用括号括起来，右边是输出类型。例如：`(x:number,y:number) => number`**

#### 接口定义函数

``` JS
interface SumFunc {
  (x:number,y:number): number
}

let mySum: SumFunc;

mySum = function (x:number,y:number) {
  return x + y
}
```

#### 可选参数

**可选参数后面不能出现必填参数**

``` JS
function create(x:string,y?:string):string{
  return x + y
}
```

#### 默认值

**配置默认值后就不受「可选参数后面不能出现必填参数」影响**

``` JS
function create(x:string='li',y:string):string{
  return x + y
}
```

#### 剩余参数

ES6 中，可以使用 `...rest` 的方式获取函数中的剩余参数（rest 参数），`rest` 参数只能是最后一个参数，其实`rest` 也是一个数组，可以用数组定义它

``` JS
function push(arr:any[],...items:any[]) {
  items.forEach(function(item){
    arr.push(item)
  })
}

let a = []
push(a,1,2,3)
```

#### 重载

重载允许一个函数接受不同数量或者类型的参数时，作出不同处理

``` JS
function reverse(x:number):number; // 函数定义
function reverse(x:string):string; // 函数定义
// 函数实现
function reverse(x:number|string):number|string {
  if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```
**Ts会优先从最前面的函数定义开始匹配，所以多个函数定义有包含关系，需要优先把精确的定义写在前面**


## 类型断言

### 基础语法

```
值 as 类型
```
或者
```
<类型>值
```

### 将一个联合类型断言为其中一个类型
``` JS
interface Cat {
  name: string;
  run(): void;
}

interface Fish {
  name: string;
  swim() : void;
}

function isFish(animal:Cat | Fish){
  if(typeof (animal as Fish).swim === 'function'){
    return true
  }
  return false
}
```
使用类型断言时一定要格外小心，尽量避免断言后调用方法或引用深层属性，以减少不必要的运行时错误。


### 将一个父类型断言为更加具体的子类

``` JS
class ApiError extends Error {
  code: number = 0;
}
class HttpError extends Error {
  statusCode: number = 200
}

function isApiError(error: Error){
  if(typeof (error as ApiError).code === 'number'){
    return true
  }
  return false
}
```

``` JS
interface ApiError extends Error {
  code: number;
}
interface HttpError extends Error {
  statusCode: number
}

function isApiError(error: Error){
  if(typeof (error as ApiError).code === 'number'){
    return true
  }
  return false
}
```

### 将任何一个类型断言为 any

``` JS
(window as any).foo = 1
```
将一个变量断言为 `any`，它极有可能掩盖了真正的类型错误，所以如果不是非常确定，就不要使用 `as any`

### 将 any 断言为一个具体的类型

应用场景：可能是第三方库未能定义好自己的类型，也有可能是历史遗留的或者其他人编写的烂代码，还可能是受到TypeScript类型系统的限制而无法精确定义类型的场景

通过将any类型断言为精确的类型，亡羊补牢，提高代码可维护性

例如：
历史代码
``` JS
function getCacheData(key:string):any{
  return (window as any).cache[key]
}
```
改进
``` JS
interface Cat {
  name: string;
  run(): void;
}
// 断言为更精准的类型
// 这时 tom 就有精准类型定义了，有相关的代码提示了
const tom = getCacheData('tom') as Cat;
tom.run()
```

### 类型断言的限制

- 联合类型可以断言为其中一个类型
- 父类可以被断言为子类
- 任何类型都可以断言为any
- any可以断言为任何类型
- 要使得`A`能被断言为`B`，只需要`A`兼容`B`或者`B`兼容A即可

### 双重断言
- 任何类型都可以断言为any
- any可以断言为任何类型

``` JS
interface Cat {
  run(): void;
}
interface Fish {
  swim(): void;
}

function testCat(cat:Cat){
  return (cat as any as Fish)
}
```
但是若使用双重断言，则可以打破「要使得 A 能够被断言为 B，只需要 A 兼容 B 或 B 兼容 A 即可」的限制，将任何一个类型断言为任何另一个类型。

**除非迫不得已，千万别用双重断言。**

### 类型断言vs类型转换

- 类型断言不是类型转换，它不会真的影响到变量的类型
- 若要进行类型转换，需要直接调用类型转换的方法

``` JS
function toBoolean(something: any):boolean{
  return Boolean(something)
}

toBoolean(1);
// 返回 true
```

### 类型断言vs类型声明

``` JS
function getCacheData(key: string): any {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom: Cat = getCacheData('tom');
tom.run();
```
这和类型断言是非常相似的，而且产生的结果也几乎是一样的——tom 在接下来的代码中都变成了 Cat 类型。
它们的区别，可以通过这个例子来理解：

```js
interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

const animal: Animal = {
    name: 'tom'
};
let tom = animal as Cat;
```
在上面的例子中，由于 Animal 兼容 Cat，故可以将 animal 断言为 Cat 赋值给 tom。

但是若直接声明 tom 为 Cat 类型

``` JS
interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

const animal: Animal = {
    name: 'tom'
};
let tom: Cat = animal;
// index.ts:12:5 - error TS2741: Property 'run' is missing in type 'Animal' but required in type 'Cat'.
```
则会报错，不允许将 animal 赋值为 Cat 类型的 tom。

这很容易理解，Animal 可以看作是 Cat 的父类，当然不能将父类的实例赋值给类型为子类的变量。

深入的讲，它们的核心区别就在于：
- animal 断言为 Cat，只需要满足 Animal 兼容 Cat 或 Cat 兼容 Animal 即可
- animal 赋值给 tom，需要满足 Cat 兼容 Animal 才行

但是 Cat 并不兼容 Animal

而在前一个例子中，由于 getCacheData('tom') 是 any 类型，any 兼容 Cat，Cat 也兼容 any，故

``` JS
const tom = getCacheData('tom') as Cat;
```
等价于
``` JS
const tom: Cat = getCacheData('tom');
```

我们最好优先使用类型声明，这也比类型断言的 as 语法更加优雅。
### 类型断言vs泛型

``` JS
function getCacheData<T>(key:string):T{
  return (window as any).cache[key]
}

interface Cat {
  name: string;
  run(): void;
}

const tom = getCacheData<Cat>('tom')
tom.run()
```

通过给 `getCacheData` 函数添加了一个泛型 `<T>`，我们可以更加规范的实现对 `getCacheData` 返回值的约束，这也同时去除掉了代码中的 `any`，是最优的一个解决方案

## 声明文件


## 内置对象

- ECMAScript 标准提供的内置对象有: `Boolean`、`Error`、`Date`、`RegExp` 等

我们可以在 TypeScript 中将变量定义为这些类型：

``` JS
const b: Boolean = new Boolean(1)
const e: Error = new Error('Error occurred')
const d: Date = new Date()
const r: RegExp = /\d{9}/
```
[更多内置对象查看文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)

- DOM 和 BOM 的内置对象有： `Document`、`HTMLElement`、`Event`、`NodeList` 等

TypeScript 中会经常用到这些类型：

``` JS
let body: HTMLElement = document.body
let allDiv: NodeList = document.querySelectorAll('div')
document.addEventListener('click',function (e: MouseEvent) {
  // 事件处理
})
```

- Node.js 不是内置对象的一部分，如果想用 TypeScript 写 Node.js，则需要引入第三方声明文件

``` sh
npm install @types/node --save-dev
```



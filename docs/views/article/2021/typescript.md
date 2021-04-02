---
title: Typescript
date: 2021-04-01
tags: 
- JavaScript
categories: 
- 文章
---

# typescript基础知识

## 原始类型

`Number` 、 `Boolean` 、 `String` 、 `Null` 、 `Undefined` 、 `Symbol` 、 `BigInt`

## 类型定义

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



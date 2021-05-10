---
title: JavaScript原理
date: 2021-02-16
tags:
 - JavaScript
categories:
 -  文章
---

## 块作用域

1. 函数不是唯一的作用域单元
2. 块作用域指的是变量和函数不仅可以属于所在的作用域，也可以属于某个代码块（通常指{...}内部）
3. 为变量显示声明作用域块，并对变量进行本地绑定是非常有用的工具

```js
function process(data) {
// 在这里做点有趣的事情
}
// 在这个块中定义的内容可以销毁了!
// 作用域块声明
{
    let someReallyBigData = { .. };
    process( someReallyBigData );
}
var btn = document.getElementById( "my_button" );
    btn.addEventListener( "click", function click(evt){
         console.log("button clicked");
    },false );
```

3. 块作用域替代方案,catch 分句具有块作用域,并兼容es3

```js
try { throw 2; } catch (a) {
    console.log(a); // 2
}
console.log(a); // ReferenceError
```

## 提升

正确思考思路：包括变量与函数在内的所有声明都会在代码被执行前首先被处理

1. 只有声明本身被提升，而赋值或者其他运行逻辑会留在原初。
2. 包括变量和函数在内的所有声明都会在任何代码被执行前首先 被处理。
3. 当你看到 var a = 2; 时，可能会认为这是一个声明。但 JavaScript 实际上会将其看成两个 声明:var a;和a=2;。第一个定义声明是在编译阶段进行的。第二个赋值声明会被留在 原地等待执行阶段。
4. 每个作用域都会进行提示操作
5. 函数会首先被提升，然后才是变量

```js
foo();//1

var foo;

function foo(){
    console.log(1)
}
foo = function(){
    console.log(2)
}
```

```js
function foo(){
    console.log(1)
}
foo();//1
foo = function(){
    console.log(2)
}
```

注意，var foo 尽管出现在 function foo()... 的声明之前，但它是重复的声明(因此被忽 略了)，因为函数声明会被提升到普通变量之前

6. 尽管重复的 var 声明会被忽略掉，但出现在后面的函数声明还是可以覆盖前面的
7. 一个普通块内部的函数声明通常会被提升到所在作用域的顶部，这个过程不会像下面的代 码暗示的那样可以被条件判断所控制

```js
foo();//b
var a = true;
if(a){
    function foo(){
        console.log('a')
    }
}else{
    function foo(){
        console.log('b')
    }
}

```

函数声明被提升，不受if控制，后声明的foo函数覆盖了前面的foo函数

## 闭包

1. 无论使用何种方式对函数类型的值进行传递，当函数在别处被调用时都可以观察到闭包
2. 这个函数在定义时的词法作用域以外的地方被调用。闭包使得函数可以继续访问定义时的词法作用域
3. 在定时器、事件监听器、 Ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步(或者同步)任务中，只要使 用了`回调函数`，实际上就是在使用闭包!
5. 动态作用域并不关心函数和作用域是如何声明以及在何处声明的，只关心它们从何处调用,但是JavaScript只有词法作用域，不具备动态作用域。
6. 闭包发生在定义时
7. **当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外被执行，这时就产生了闭包**
8. 闭包是指有权访问另一个函数作用域中的变量的函数。
9. 常见创建闭包方式就是在一个函数内部创建另一个函数

```js
// 块级作用域
(function(){
    // 函数中创建函数
    return function(){
        // ...
    }
})();
```

```js
function foo() {
    console.log( a ); // 2
}
function bar() {
    var a = 3;
    foo();
}
var a = 2;
bar();

```

词法作用域让 foo() 中的 a 通过 RHS 引用到了全局作用域中的 a，因此会输出 2。

### 变量的作用域

1. 在函数内部声明一个变量，带var的则变成函数内部局部变量，不带var则变成全局变量
2. 函数可以创造函数作用域，函数内部可以访问外部变量，外部不能访问函数内部变量
3. 变量的搜索是从内到外，先从函数内部搜索，再顺着作用域链往外逐层搜索，一直搜索到全局对象为止

### 变量的生存周期

1. 全局变量是永久的，除非主动注销，函数内部用var声明的局部变量当退出函数后便被注销了。
2. 闭包函数返回了一个函数，这个函数可以访问闭包函数内部变量，当这个返回的函数被引用，且这个函数也调用闭包函数的局部变量，那么这些被引用的闭包内部变量会一直存在。这个闭包结构，局部变量的生命被延续了

### 闭包的更多作用

1. 闭包可以帮助把一些不需要暴露在全局的变量封装成“私有变量”
2. 延续局部变量的生命周期

### 闭包与内存管理

1. 使用闭包的一部分原因是我们主动把一些变量封闭在闭包中，因为可能在以后还需要用到，把这些变量放在闭包和放在全局作用域，对内存方面的影响是一致的，这里 并不能说成是内存泄露。
2. 闭包的作用域链中保存着一些DOM节点，可能造成内存泄露。但这本身不是闭包的问题，也不是JavaScript的问题（与垃圾收集机制有关）
3. 在基于引用计数策略的垃圾回收机制中，如果两个对象之间形成循环引用，那么这两个对象都无法回收，但循环引用造成的内存泄露在本质上也不是闭包造成的
4. 处理方案就是手动将循环引用的变量设为**null**

### 总结

函数表达式特点：

1. 函数表达式不同于函数声明。函数声明要求有名字，但函数表达式不需要。没有名字的函数表达式也可以叫做匿名函数
2. 在无法确定如何引用函数的情况下，递归函数就会变得比较复杂。
3. 递归函数应该始终使用arguments.callee来递归地调用自身，不要使用匿名函数。（严格模式arguments.callee不能使用，可以使用具名函数来实现递归调用）

当在函数内部定义了其他函数时，就创建了闭包。
闭包有权访问包含函数内部的所有变量，原理如下：

1. 在后台执行环境中，闭包的作用域包含着它自己的作用域、包含函数作用域和全局作用域。
2. 通常，函数的作用域及其所有变量都会在函数执行后被销毁。
3. 但是，当函数返回了闭包一个时，这个函数的作用域将会一直在内存中保存到闭包不存在为止。

使用闭包模仿块级作用域要点如下：

1. 创建并立即调用一个函数，这样既可以执行其中的代码，又不会在内存中留下对该函数的引用。
2. 结果就是函数内部的所有变量都会被立即销毁--除非将某些变量赋值给了包含作用域（外部作用域）中的变量
3. 函数声明后面不能跟圆括号，然而，函数表达式的后面可以跟圆括号。要将函数声明转换为函数表达式，只要给它加上一对圆括号即可

```js
(function(){
    // 这里是块级作用域
})()
```

这种做法可以减少闭包占用的内存问题，因为没有指向匿名函数的引用。只要函数执行完毕，就可以立即销毁其作用域链了

闭包在对象中创建私有变量要点如下：

1. 即使JavaScript中没有正式的私有对象属性的概念，但可以使用闭包来实现公有方法，而通过公有方法可以访问在包含作用域中定义的变量。
2. 有权访问私有变量的公有方法叫做特权方法。
3. 可以使用构造函数模式、原型模式来实现自定义类型的特权方法，也可以使用模块模式、增强的模块模式来实现单例的特权方法
4. 如果必须创建一个对象并以某些数据对其进行初始化，同时还要公开一些能够访问这些私有
数据的方法，那么就可以使用模块模式。

```js
// 增强的模块模式
var application = (function(){
    // 私有变量和函数
    var components = [];
    // 初始化
    components.push(new BaseComponent());
    // 创建application的一个局部副本
    var app = new BaseComponent();
    // 公共接口
    app.getComponentCount = function(){
        return components.length
    }
    app.getComponent = function(component){
        if(typeof component == "object"){
            components.push(component)
        }
    }
    // 返回这个副本
    return app;
})()
```

::: warning 注意：

1. 因为创建闭包必维护须额外的作用域，所以过度使用它们可能会占用大量内存
2. 使用闭包和私有变量的一个明显的不足之处，多查找作用域中的一个层次，就会在一定程度上影响查找速度。
:::

## 模块

模块模式必须具备两个条件：

1. 必须有外部封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）
2. 封闭函数必须至少返回一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或修改私有变量

 一个具有函数属性的对象本身并不是真正的模块，从方便观察的角度看，一个函数调用所返回的，只有数据属性而没有闭包函数的对象不是真正的模块

```js
var foo = (funtion CoolModule(id){
    function change(){
        // 修改公共Api
        publicAPI.identify = identify2
    }
    function identify1(){
        console.log(id)
    }
    function identify2(){
        console.log(id.toUpperCase())
    }
    var publicAPI = {
        change:change,
        identify:identify1
    }
})("foo module")

foo.identify();// foo module
foo.change();
foo.identify();// FOO MODULE
```

## this

- 在对象内的方法，this指向这个对象
- 在普通函数内容，this指向全局变量（window对象）
- 在构造器内，this指向实例对象
- Function.prototype.call(),Function.prototype.apply() 动态传入this指向

### this的丢失

```js
var obj = {
    myName: 'sven',
    getName: function(){
        return this.myName;
    }
};
console.log( obj.getName() ); // 输出：'sven'
var getName2 = obj.getName;
console.log( getName2() ); // 输出：undefined
```

::: warning 注意：
在obj的getName方法内的this指向obj，当执行getName时输出obj下的myName属性<br>
当把getName赋给getName2时，getName2是一个普通函数，this指向window，所以取不到myName属性值
:::

### 误解

1. 把this理解成指向函数本身
2. this指向函数的作用域（this在任何情况下都不指向函数作用域）

注意：想要把this和词法作用域查找混合使用，这是无法实现的

### this是什么

1. this是运行时绑定的，不是在编译时绑定，它的上下文取决于函数调用时的各种情况。
2. this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式
3. this实际是函数被调用时发生的绑定，它指向什么完全取决函数在哪里被调用
3. 当函数被调用时，会创建一个活动记录（有时候也称上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。this就是记录的一个属性，会在函数的执行过程中用到。

### this绑定规则

#### 默认绑定

独立函数调用，可以把这条规则看作是无法应用其他规则时的默认规则。

默认绑定判定：

1. 直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。
2. 如果使用严格模式(`strict mode`)，那么全局对象将无法使用默认绑定，因此 this 会绑定 到 `undefined`,非严格模式绑定到全局对象。

#### 隐式绑定

1. 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象
2. 对象属性引用链中只有对顶层或者说最后一层会影响调用位置

隐式丢失：

1. 一个最常见的this绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说会应用默认绑定，从而把this绑定到全局对象上或者undefined，取决于是否严格模式
2. 一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时,`传参其实是一种隐式赋值`

```js
function foo() {
    console.log( this.a );
}
function doFoo(fn) {
    // fn 其实引用的是 foo
    fn(); // <-- 调用位置!
}
var obj = {
    a: 2,
    foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
doFoo( obj.foo ); // "oops, global"
```

3. 调用回调函数的函数可能会修改this

```js
function foo(){
    console.log(this.a)
}

var obj = {
    a:2,
    foo:foo
}
var a = "oops global";
setTimeout(obj.foo,100);//oops global
/****************************************/
// javascript 内置函数伪代码
function setTimeout(fn,delay){
    // 等待delay毫秒
    fn()//<-- 调用位置
}
```

#### 显示绑定

1. call
2. apply
3. bind

```js
function bind(fn,obj){
    return fn(){
        return fn.apply(obj,arguments)
    }
}
```

#### new绑定

重新定义JavaScript中的“构造函数”：在JavaScript中，构造函数只是一些使用new操作符时被调用的函数。他并不会属于某个类，也不会实例化一个类。

使用new来调用函数，或者说发生构造函数调用时，会自动执行下面操作

1. 创建（构造）一个全新的对象
2. 这个新对象会被执行[[原型]]连接
3. `这个新对象会绑定到函数调用的this`（this绑定）
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象

#### 绑定优先级

1. 由new调用？绑定到新创建的对象
2. 由call或apply或bind调用？绑定到指定对象
3. 由上下文调用?绑定到那个上下文对象
4. 默认：在严格模式绑定到undefined，否则绑定到全局对象

## 对象

### 构造函数

1. new 会劫持所有普通函数并用构造对象的形式来调用它
2. 对象的 .constructor 会默认指向一个函数，这个函数可以通过对象的 .prototype 引用
3. constructor并不表示构造
4. a1.constructor 是一个非常不可靠并且不安全的引用。通常来说要尽量避免使用这些引用。

### 继承（原型）

原型链：[[Prototype]] 机制就是存在于对象中的一个内部链接，它会引用其他
对象。通常来说，这个链接的作用是如果在对象上没有找到需要的属性或者方法引用，引擎就会继续在 [[Prototype]] 关联的对象上进行查找。同理，如果在后者中也没有找到需要的引用就会继续查找它的[[Prototype]]，以此类推。这一系列对象的链接被称之为“原型链”

修改对象关联

1. Object.create()

```js
// ES6 之前需要抛弃默认的 Bar.prototype
// Object.create() 会创建一个新对象(Bar)并把它关联到制定对象(Foo)
Bar.ptototype = Object.create( Foo.prototype );
var Bar = Object.create(Foo)
```

2. Object.setPrototypeOf()

```js
// ES6 开始可以直接修改现有的 Bar.prototype
Object.setPrototypeOf( Bar.prototype, Foo.prototype );
```

3. `Object.create(null)` 会创建一个拥有空 [[Prototype]] 链接对象，这个对象无法进行委托。这些特殊的空 [[Prototype]] 对象通常被称之为“字典”，它完全不受原型链干扰，因此`非常适合用来储存数据`
4. 关联两个对象最常用的方法是使用 new 关键词进行函数调用

检查关系

```js
function Foo(){}
Foo.prototype.blah = ''
var a = new Foo()

// 方法1.instanceOf
// 在a的整条[[Prototype]] 链中是否有指向Foo.prototype的对象
// 这个方法只能处理对象(a)和函数(带 .prototype 引用的 Foo)之间的关系。
// 如果你想判断两个对象(比如 a 和 b)之间是否通过 [[Prototype]] 链关联，只用 instanceof 无法实现
a instanceOf Foo; // true
// 方法2.isPrototypeOf
// a 是否出现在Foo原型链中
Foo.prototype.isPrototypeOf(a); // true
```

注意：对象之间的关系不是复制而是委托

## 委托

1. 行为委托认为对象之间是兄弟关系，互相委托，而不是父类和子类的关系。JavaScript 的 [[Prototype]] 机制本质上就是行为委托机制
2. 对象关联是一种编码风格，它提倡的是直接创建和关联对象，不把它抽象成类。对象关联可以用基于[[Prototype]]的行为委托非常自然的实现
3. 使用简洁方法时一定要小心这一点。如果你`需要自我引用`的话，那最好使用传统的`具名函数表达式`来定义对应的函数(baz: function baz(){..})，不要使用简洁方法
4. 对象关联可以更好地支持关注分离(separation of concerns)原则，创建和初始化并不需要 合并为一个步骤

```js
var LoginController = {
    error:[],
    getUser(){},
    getPassword(){}
}
var AuthController = {
    error:[],
    checkAuth(){},
    server(url,data){}
}
// 现在把 AuthController 关联到 LoginController
Object.setPrototypeOf(AuthController,LoginController)
```

行为委托与class模式对比

```js
// class
class Widget {
    constructor(width, height) {
        this.height = height || 50;
        this.width = width || 50;
        this.$elem = null;
    }
    render($where) {
        if (this.$elem) {
            this.$elem.css({
                width: this.width + 'px',
                height: this.height + 'px'
            }).appendTo($where)
        }
    }
}
class Button extends Widget {
    constructor(width, height, label) {
        super(width, height);
        this.label = label || 'Default';
        this.$elem = $('<button>').text(this.label);
    }
    render($where) {
        super($where);
        this.$elem.click(this.onClick.bind(this));
    }
    onClick(ev) {
        console.log("Button " + this.label + "clciked!")
    }
}
$(document).ready(function () {
    var $body = $(document.body);
    var btn1 = new Button(125, 30, "Hello");
    var btn2 = new Button(150, 40, 'word');
    btn1.render($body);
    btn2.render($body);
})


```

```js
// 行为委托
var Widget = {
    init(width, height) {
        this.width = width || 50;
        this.height = height || 50;
        this.$elem = null;
    },
    insert($where) {
        if (this.$elem) {
            this.$elem.css({
                height: this.height + 'px',
                width: this.width + 'px'
            }).appendTo($where)
        }
    }
}

// 对象关联
var Button = Object.create(Widget);

Button.setup = function (width, height, label) {
    // 委托调用
    this.init(width, height);
    this.label = label || 'Default';
    this.$elem = $('<button>').text(this.label);
}
Button.build = function ($where) {
    // 委托调用
    this.insert($where);
    this.$elem.click(this.onClick.bind(this));
}
Button.onClick = function () {
    console.log("Button '" + this.label + "' clicked!");
}

$(document).ready(function () {
    var $body = $(document.body);
    // 创建btn1对象并把它关联到Button上
    var btn1 = Object.create(Button);
    btn1.setup(125, 30, "Hello")
    // 创建btn2对象并把它关联到Button上
    var btn2 = Object.create(Button);
    btn2.setup(150, 40, 'word')
    btn1.render($body);
    btn2.render($body);
})
```

## call/apply

用途：

- 改变this指向
- 借用其他对象的方法(Array.prototype.push.call(this,参数))

区别：
call与apply用法几乎一样，除了传入参数形式不同
都接受两个参数，第一个为this对象的指向，第二个参数是传入函数的参数

- apply第二个参数为数组或类数组
- call为具体参数，从第二个参数开始往后，每个参数被一次传入函数

选取：

apply：当我们不关心具体有多少参数被传入函数时
call：如果明确知道函数接受多少个参数，而且想一目了然的表达形参和实参的对应关系

::: warning 注意：
fn.apply(null,argument)，在严格模式中this指向null，默认模式中this指向默认的宿主对象
:::

## 高阶函数

### 函数节流

```js
//核心代码
//短时间内多次触发，用定时器延迟处理（有点防抖的意思）
var throttle = function ( fn, interval ) {
    var __self = fn, // 保存需要被延迟执行的函数引用
        timer, // 定时器
        firstTime = true; // 是否是第一次调用
    return function () {
        var args = arguments,
            __me = this;
        if ( firstTime ) { // 如果是第一次调用，不需延迟执行
            __self.apply(__me, args);
            return firstTime = false;
        }
        if ( timer ) { // 如果定时器还在，说明前一次延迟执行还没有完成
            return false;
        }
        timer = setTimeout(function () { // 延迟一段时间执行
            clearTimeout(timer);
            timer = null;
            __self.apply(__me, args);
        }, interval || 500 );
    };
};

//实例
window.onresize = throttle(function(){
    console.log( 1 );
}, 500 );
```

### 分时函数

```js
//核心代码
//数据量大时，分批执行
var timeChunk = function( ary, fn, count ){
    var obj,
        t;
    var len = ary.length;
    var start = function(){
        for ( var i = 0; i < Math.min( count || 1, ary.length ); i++ ){
        var obj = ary.shift();
            fn( obj );
        }
    };
    return function(){
        t = setInterval(function(){
            if ( ary.length === 0 ){ // 如果全部节点都已经被创建好
                return clearInterval( t );
            }
            start();
        }, 200 ); // 分批执行的时间间隔，也可以用参数的形式传入
    };
};

//实例
var ary = [];
for ( var i = 1; i <= 1000; i++ ){
    ary.push( i );
};
var renderFriendList = timeChunk( ary, function( n ){
    var div = document.createElement( 'div' );
    div.innerHTML = n;
    document.body.appendChild( div );
}, 8 );
renderFriendList();
```

### 惰性加载函数

```js
//核心代码
//进入条件分支后重写这个函数（希望执行的条件的函数）
var addEvent = function( elem, type, handler ){
    if ( window.addEventListener ){
        addEvent = function( elem, type, handler ){
            elem.addEventListener( type, handler, false );
        }
    }else if ( window.attachEvent ){
        addEvent = function( elem, type, handler ){
            elem.attachEvent( 'on' + type, handler );
        }
    }
    addEvent( elem, type, handler );
};
```

## 类型判断

``` JS
const toString = Object.prototype.toString

export const isObject = function(val){
    return toString.call(vall) === '[object Object]'
}

export const isBoolean = function (val) {
    return toString.call(vall) === '[object Boolean]'
}

export const isNumber = function (val) {
    return toString.call(vall) === '[object Number]'
}

export const isString = function (val) {
    return toString.call(vall) === '[object String]'
}

export const isFunction = function (val) {
    return toString.call(vall) === '[object Function]'
}

export const isArray = function (val) {
    return toString.call(vall) === '[object Array]'
}

export const isDefined = function (val) {
    return val !== undefined && val !== null
}

export const isEmpty = function (val) {
    // undefined or null
    if(val == null){ return true }
    if(typeof val === 'boolean'){ return false }
    if(typeof val === 'number'){ return !val }
    if(val instanceof Error){ return val.message === '' }

    switch (Object.prototype.toString(val)) {
        // String or Array
        case '[object String]':
        case '[object Array]':    
           return !val.length
        // Map or File or Set
        case '[object Map]':
        case '[object File]':
        case '[object Set]':
            return !val.size
        // Plain Object
        case '[object Object]':
            return !Object.keys(val).length
    }

    return false
}
```






## 变量类型和计算

- typeof可以判断哪些类型
  - 识别所有的值类型，识别函数，判断是否是引用类型（不可在细分，都是object）
- 何时使用`===`何时使用`==`
  - 除了`== null`之外，其他一律用 `===`
  ```js
  const obj = { x: 1 }
  if(obj.a == null){}
  // 相当于
  if( obj.a === null || obj.a === undefined){}
  ```
- 值类型和引用类型的区别
  - 值类型：undefined、boolean、number、symbol、string
  - 引用类型：object、array、function（特殊引用类型，当不用存储数据，所以没有”拷贝、复制函数“这说法）、null（特殊引用类型，指针指向为空地址）
- 手写深拷贝

```js
function deepclone (obj){
    if(typeof obj !== 'object' && typeof obj !=='array' && obj == null){
        return obj
    }
    
    let result = Array.isArray(obj) ? [] : {}
    
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            result[key] = deepclone(obj[key])
        }
    }
    
    return result
}
```
- if语句和逻辑运算
  - truly变量：!!a === true 的变量
  - falsely变量：!!a === false 的变量

## 原型、原型链
![原型、原型链](/img/原型链.jpg)
- 牢记两点：
  - `__proto__`和`constructor`属性是对象所独有的；
  - `prototype`属性是`函数所独有的`，因为函数也是一种对象，所以函数也拥有`__proto__`和`constructor`属性。
- `__proto__`属性的作用就是当访问一个对象的属性时，如果该对象内部不存在这个属性，那么就会去它的`__proto__`属性所指向的那个对象（父对象）里找，一直找，直到`__proto__`属性的终点null，再往上找就相当于在null上取值，会报错。通过__proto__属性将对象连接起来的这条链路即我们所谓的原型链。
- `prototype`属性的作用就是让该函数所实例化的对象们都可以找到公用的属性和方法，即`f1.__proto__ === Foo.prototype`。
- `constructor`属性的含义就是指向该对象的构造函数，所有函数（此时看成对象了）最终的构造函数都指向`Function`。
- class继承
  - constructor
  - 属性
  - 方法
  - extends
  - super
- 类型判断instanceof
- 原型和原型链
  - 每个class都有显示原型`prototype`，`prototype`是引用类型
  - 每个实例都有隐式原型`__proto__`，`__proto__`是引用类型
  - 实例的`__proto__`指向对应class的`prototype`
  - 获取属性或者方法时，先在自身属性和方法查找
  - 如果找不到再去`__proto__`中查找
- 如何准确判断一个变量是不是数组
  - `a instanceof Array`
- 手写一个简易JQuery，考虑插件和扩展性
```js
class JQuery {
  constructor(selector) {
    const result = document.querySelectorAll(selector)
    const length = result.length
    for (let i = 0; i < length; i++) {
      this[i] = result[i]
    }
    this.length = length
    this.selector = selector
  }

  get(index) {
    return this[index]
  }

  each(fn) {
    for (let i = 0; i < this.length; i++) {
      fn(this[i])
    }
  }

  on(type, fn) {
    this.each(elem => {
      elem.addEventListener(type, fn, false)
    })
  }

}

// 插件
JQuery.prototype.dialog = function (val) {
  alert(val)
}

// ”造轮子“
class MyJQuery extends JQuery {
  constructor(selector) {
    super(selector)
  }
  addClass(className) {
    // 添加样式逻辑代码
  }
}
```
- class原型本质，怎么理解
  - 原型和原型链的图示
  - 属性和方法的执行规则


## 作用域和闭包

- 作用域
  - 全局作用域
  - 函数作用域
  - 块级作用域
  ```js
  if(true){
      let a = 10
  }
  console.log(a) // 会报错
  ```
- 自由变量
  - 一个变量在当前作用域没被定义，但被使用了
  - 向上级作用域，一层层查找，直到找到为止
  - 如果到全局作用域都没找到，则会报`xx is not defined`
- 闭包
  - 闭包发生在定义时
  - 所有变量的查找，**是在函数定义的地方，向上级作用域查找**，不是在执行的地方查找！！！
- 产生闭包
  - 作用域被应用的特殊情况，有两种表现
  - 函数作为参数被传递
  - 函数作为返回值被返回 
- this 
  - **this是在函数执行的时候确定的**
  - 作为普通函数，this指向window
  - 使用bind call apply（bind会返回一个新的函数，call、apply就立即执行了），this指向传入的对象
  - 作为对象方法被调用,this指向对象
  - 在class方法中被调用,this指向class对象
  - 箭头函数,this绑定上级作用域this值
  - 传参其实是一种隐式赋值,this会丢失绑定对象
- this的不同应用场景，如何取值
- 手写bind函数
```js
// const fn2 = fn.bind({a:100})

// 第一个参数是this绑定对象，后面参数是传给被绑定对象的参数
Function.prototype.bind2 = function () {
  // 将参数拆解为数组
  const args = Array.prototype.slice.call(arguments)
  const t = args.shift() // 获取this
  const self = this // 被绑定函数fn
  return function () {
    return self.apply(t, args)
  }
}
```
- 闭包在实际开发的应用场景
  - 隐藏数据，闭包隐藏数据，只提供API
  ```js
  function createCache(){
      const data = {}
      return {
          get: function(key){
              return data[key]
          },
          set: function(key,value){
              data[key] = value
          }
      }
  }
  
  const d = createCache()
  d.set('a',100)
  d.get('a') // 100
  ```
- 生成10个div标签，点击弹出对应的索引
```js
for (let i = 0; i < 10; i++) {
  let a = document.createElement('div')
  a.innerHTML = i
  a.addEventListener('click', function () {
    alert(i)
  }, false)

  document.body.appendChild(a)
}
```

## 异步和单线程

- 单线程和异步
  - JS是单线程语言，只能同时做一件事
  - 浏览器和nodejs已支持js启动**进程**，如web worker
  - JS和DOM渲染公用同一个线程，因为JS可修改DOM结构
  - 遇到等待（网络请求，定时任务）不能卡着
  - 需要异步
  - 回调callback函数形式
- 应用场景
  - 网络请求，如ajax图片加载
  - 定时任务，如setTimeout
- callback hell和promise
  - promise解决callback hell问题，callback本身没问题
- 同步和异步区别是什么
  - **基于JS单线程语言**
  - 异步不会阻塞代码执行
  - 同步会阻塞代码执行
- 手写promise加载一张图片
```js
function loadimg(src) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }
    img.src = src
  })
}

const url = 'https://cn.vuejs.org/images/lifecycle.png'
const url2 = 'https://vuex.vuejs.org/vuex.png'

loadimg(url)
  .then(img => {
    console.log(img.src); // https://cn.vuejs.org/images/lifecycle.png
    return loadimg(url2) // 返回一个promise
  }).then(img => {
    // img 是上个then返回 promise resolve结果
    console.log(img.src); // https://vuex.vuejs.org/vuex.png
  })
```
- 前端使用异步的场景有哪些
  - 网络请求，如ajax图片加载
  - 定时任务，如setTimeout

### 异步问答

- 请描述event-loop（事件循环/事件轮询）的机制，可画图
- 什么是宏任务微任务，有什么区别
  - 宏任务：setTimeout、setInterval、ajax、DOM事件
  - 微任务：Promise、async/await
  - 微任务执行时机比宏任务早
- promise有哪三种状态，如何变化
  - pending resolved rejected
  - pending=>resolved
  - pending=>rejected
- promise then和catch连接问题
  - **只要没报错都是返回resolved，只要有报错都是返回rejected**
  - resolved后触发then回调，rejected后触发catch回调
```js
// 第一题
Promise.resolve().then(()=>{
    console.log(1)
}).catch(()=>{
    console.log(2)
}).then(()=>{
    console.log(3)
})
// 1
// 3

// 第二题
Promise.resolve().then(()=>{
    console.log(1)
    throw new Error('error1')
}).catch(()=>{
    console.log(2)
}).then(()=>{
    console.log(3)
})
// 1
// 2
// 3

// 第三题
Promise.resolve().then(()=>{
    console.log(1)
    throw new Error('error1')
}).catch(()=>{
    console.log(2)
}).catch(()=>{
    console.log(3)
})
// 1
// 2
```
- async/await 语法
```js
async function fn (){
  return 100
}

(async function(){
  const a = fn() // ?
  console.log(a); // Promise {100}
  const b = await fn() // ?
  console.log(b); // 100
})()

// 执行完毕打印出什么结果
(async function(){
   console.log('start')
   const a = await 100
   console.log('a',a)
   const b = await Promise.resolve(200)
   console.log('b',b)
   const c = await Promise.reject(300) // 报错
   console.log('c',c)
   console.log('end')
})()
// start
// a 100
// b 200
// 报错
```
## event-loop
- js是单线程
- 异步基于回调实现
- event-loop就是异步回调的实现原理
  - 同步代码，一行一行放在call stack（调用堆栈）执行
  - 遇到异步，先”记录“下，等待时机（定时，网络请求）
  - 时机到了，就移动到callback queue(回调队列)
  - 如果call stack为空的时候（即同步代码执行完），**会尝试DOM渲染**，event-loop开始工作
  - 轮询查找callback queue，如果有则移动到call stack中执行
  - 然后继续轮询查找

### DOM事件与event-loop

- js是单线程的
- 异步（setTimeout，ajax等）使用回调，基于event-loop
- DOM事件也使用回调，基于event-loop

## promise

- 三个状态
  - pending resolved rejected
- 状态的表现和变化
  - pending=>resolved
  - pending=>rejected
- then和catch对状态的影响
  - **只要没报错都是返回resolved，只要有报错都是返回rejected**
  - then正常返回resolved，里面有报错则返回rejected
  - **catch正常返回resolved**，里面有报错则返回rejected
  - resolved后触发then回调，rejected后触发catch回调

## async/await

- 异步回调callback hell
- promise then catch 链式调用，但也是基于回调函数
- async/await 同步语法，彻底消灭回调函数
- 和promise不互斥，相辅相成
- **执行async函数返回promise对象**
- await相当于promise的then
- **try/catch**捕获async异常，代替了promise的catch
- async/awati只是语法糖, await 当 then 用，如果 `await` 后面返回的事 `Promise.reject` 会报错
- js还是单线程，还是有异步，还是基于event-loop
- **await代码后面的代码可以看出是callback里面的内容，被异步执行了**

## for...of常用于异步的遍历

- for...in（以及forEach for）是常规的同步遍历
- **for...of常用于异步的遍历**,等上个代码执行完再执行下个代码
- 可遍历数组和字符串，不能遍历对象
```js
function muti(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num * num)
    }, 1000)
  })
}

const arr = [1, 3, 4]

!(async function () {
  for (let i of arr) {
    const res = await muti(i)
    console.log(res);
  }
})()
```
## 宏任务macroTask和微任务microTask

- 宏任务：setTimeout、setInterval、ajax、DOM事件。**DOM渲染后触发**，如setTimeout
- 微任务：promise、async/await。**DOM渲染前触发**，如promise
- **微任务执行时机比宏任务早**
- event-loop和DOM渲染
  - 每次Call Stack清空（即每次轮询结束），即同步任务执行完成
  - 都是DOM重新渲染的机会，DOM结构有变都会重新渲染
  - 然后再次触发下次event-loop
- 宏任务macroTask和微任务microTask区别
  - 微任务是ES6语法规定的=>mirco task queue
  - 宏任务是浏览器规定的=>web API
- call stack空闲 => mirco task queue => 尝试DOM渲染 => 触发event-loop

```js
const div1 = document.createElement('div')
div1.innerHTML = 'dddd'
$('#container').append(div1)
// 微任务是在DOM渲染前触发
Promise.resolve().then(() => {
  alert('promise') // DOM是否渲染 NO
})
// 宏任务是DOM渲染后触发
setTimeout(() => {
  alert('setTimeout') // DOM是否渲染 YES
})
```
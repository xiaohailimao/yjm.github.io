# JavaScript原理
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
7. 当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外被执行，这时就产生了闭包


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
### 误解！
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


### （原型）继承
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
---
title: JavaScript设计模式
date: 2018-12-15
tags:
 - JavaScript
categories:
 -  文章
---
![设计模式](/img/img-shejimoshi.png)

## 通用的惰性单例

**单例模式定义**：保证一个类仅有一个实例，并提供一个访问它的全局访问点

```javascript
// 单例核心代码
// 获取单例
// 用到了闭包和高阶函数
var getSingle = function(fn){
    var result; // 内部变量不会被销毁
    // 返回一个函数、惰性单例
    return function(){
        return result || (result = fn.apply(this,arguments));
    }
}
```

- getSingle与jq中的one方法有相同作用
- 惰性单例技术只有在被调用时才执行，并且只创建唯一一个
- 创建对象和管理单例的职责被分布在两个不同的方法中

实例

```javascript
//创建对象
var createLoginLayer = function(){
    var div = document.createElement('div');
    div.innerHTML = '我是登录浮窗';
    div.style.display = 'none';
    document.body.appendChild('div');
    return div;
}
//管理单例
// createSingleLoginLayer被执行一次后，createLoginLayer的执行结果将被储存起来（getSingle 中的 result 变量），
// createSingleLoginLayer后面每次调用都返回之前createLoginLayer的储存结果
var createSingleLoginLayer = getSingle(createLoginLayer);

document.getElementById('loginBtn').onclick = function(){
    var loginLayer = createSingleLoginLayer();
    loginLayer.style.display = 'block';
}
```

## 策略模式

**策略模式定义**：定义一系列的算法，把它们一个个封装起来，并且使他们可以互相替换。  

策略模式的优点：

1. 策略模式利用组合、委托和多态等技术思想，可以有效地规避多重条件选择语句
2. 策略模式提供了对开发-封闭原则的完美支持，将算法封装在独立的strategy中，使得它们易于切换，易于理解，易于扩展
3. 策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作
4. 在策略模式中利用组合和委托Context拥有执行算法的能力，这也是继承的一种更轻便的替代方案

在JavaScript语言中的策略模式中，策略类往往被函数所替代，这时策略模式就成为一种“隐形”的模式

```js
// 隐形的策略模式
var S = function(salary){
    return salary *10
}
var A = function(salary){
    return salary *20
}
var B = function(salary){
    return salary *30
}
var calculateBonus = function(fn,salary){
    return fn(salary)
}
calculateBonus(S,1000); // 10000
```

```js
// 显示说明这是策略模式
var strategies = {
    S:function(salary){
        return salary *10
    },
    A:function(salary){
        return salary *20
    },
    B:function(salary){
        return salary *30
    }
}

var calculateBonus = function(key,salary){
    return strategies[key](salary);
}
calculateBonus(S,1000); // 10000
```

## 代理模式

代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

在 JavaScript开发中最常用的是虚拟代理和缓存代理。虽然代理模式非常有用，但我们在编写业务代码的时候，往往不需要去预先猜测是否需要使用代理模式。当真正发现不方便直接访问某个对象的时候，再编写代理也不迟。

代理的意义

1. 能够更好的实现单一职责原则，
2. 通过代理模式给系统添加新行为，这是符合开放-封闭原则

代理和本体接口的一致性

1. 用户可以放心地请求代理，他只关心是否能得到想要的结果
2. 在任何使用本体的地方都可以替换成使用代理

虚拟代理

```js
// 虚拟代理实现图片预加载
// 代理接口与本体接口统一，可以随时取消代理，直接调用本体函数
// 每个函数职责单一
// 代理函数对系统新增方法，且不改变本体函数，符合开放-封闭原则
var myImage = (function(){
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return function(src){
        imgNode.src = src
    }
})();

var proxyImage = (function(){
    var img = new Image;
    img.onload = function(){
        myImage(this.src)
    }
    return function(src){
        myImage('loading.gif');
        img.src = src;
    }
})()

proxyImage('imgSrc.png');
```

缓存代理

```js
// 缓存代理-计算乘积
// 代理接口与本体接口统一，可以随时取消代理，直接调用本体函数
// 每个函数职责单一
// 代理函数对计算值进行缓存，且不改变本体函数，符合开放-封闭原则
var mult = function(){
    console.log('开始计算乘积');
    var a = 1;
    for(var i=0,l=arguments.length;i<l;i++){
        a = a * arguments[i]
    }
    return a;
}

var proxyMult = function(){
    var cache = {};
    return function(){
        var args = Array.prototype.join.call(arguments,',');
        if(args in cache){
            return cache[args]
        }
        return cache[args] = mult.apply(this,arguments);
    }
}()

proxyMult(1,2,3,4); //输出：24
proxyMult(1,2,3,4); //输出：24(cache)
```

## 装饰者模式

给对象动态地增加职责的方式称为装饰者（decorator）模式

```js
Function.prototype.before = function(beforefn){
    var _self = this;
    return function(){
        beforefn.apply(this,arguments);
        return _self.apply(this,arguments);
    }
}
```

```js
Function.prototype.after = function(afterfn){
    var _self = this;
    return function(){
        var ret = _self.apply(this,arguments);
        afterfn.apply(this,arguments);
        return ret;
    }
}
```

装饰者模式和代理模式区别：最主要的区别在于它们的意图和设计目的。

1. 代理模式的目的是，当直接访问本体不方便或者不符合需求时，为这个本体提供一个代替者。本体定义了关键功能，而代理提供或拒绝它的访问，或者在访问本体之前做一些额外的事情。装饰者模式的作用就是为对象动态加入行为。
2. 代理模式强调一种关系，这种关系可以静态的表达，这种关系在一开始就可以被确定。装饰者模式用于一开始不能确定对象的全部功能时。
3. 代理模式通常只有一层代理-本体的引用，而装饰者模式经常会形成一条长长的装饰链。

## 组合模式

适用场景：

1. `表示对象的部分-整体层次结构`。组合模式可以方便地构造一棵树来表示对象的部分-整体结构。特别是我们在开发期间不确定这棵树到底存在多少层次的时候。在树的构造最终完成之后，只需要通过请求树的最顶层对象，便能对整棵树做统一的操作。`在组合模式中增加和删除树的节点非常方便，并且符合开放-封闭原则`。
2. `客户希望统一对待树种的所有对象`。组合模式使客户可以忽略组合对象和叶对象的区别，客户在面对这课树的时候，不用关心当前在处理的对象是组合对象还是叶对象，也就不用写一堆if，else语句来分别处理他们。`组合对象和叶对象会各自做自己正确的事情，这是组合模式最重要的能力`

```js
// 组合模式的例子——扫描文件夹
// 忽略组合对象和叶对象区别，都拥scan方法
// 只需操作最顶层对象scan方法，既可以操作整个树
// 自由增加和删除树节点
// 组合对象和叶对象做不同的事
var Folder = function(name){
    this.name = name;
    this.files = [];
}
Folder.prototype.add = function(file){
    console.log(file)
    this.files.push(file)
}
Folder.prototype.scan = function(){
    console.log('开始扫描文件夹：'+this.name);
    // 遍历执行扫描
    for(var i=0,file,files = this.files;file = files[i++];){
        file.scan()
    }
}

var File = function(name){
    this.name = name
}
File.prototype.add = function(){
    throw new Error('文件下面不能再添加文件')
}
File.prototype.scan = function(){
    console.log('开始扫描文件：'+this.name);
}

var folder = new Folder('学习资料');
var folder1 = new Folder('JavaScript');
var folder2 = new Folder('JQuery');

var file1 = new File('JavaScript设计模式与开发实践');
var file2 = new File('精通JQuery');
var file3 = new File('重构与模式');

folder1.add(file1);
folder2.add(file2);

folder.add(folder1);
folder.add(folder2);
folder.add(file3);

var folder3 = new Folder('Nodejs');
var file4 = new File('深入浅出Node.js');

var file5 = new File('JavaScript语言精髓与编程实践');

folder.add(folder3);
folder.add(file5);
folder.scan();

// folder.files 存储函数引用
// [
//     {
//         name: 'JavaScript',
//         files: [
//             {
//                 name: 'JavaScript设计模式与开发实践'
//             }
//         ]
//     },
//     {
//         name: 'JQuery',
//         files: [
//             {
//                 name: '精通JQuery'
//             }
//         ]
//     },
//     {
//         name: '重构与模式'
//     },
//     {
//         name: 'Nodejs',
//         files: []
//     },
//     {
//         name: 'JavaScript语言精髓与编程实践'
//     }
// ]
```

## 模板方法模式

基于继承的设计模式，是一种典型的通过封装变化提高系统扩展性的设计模式。

在传统的面向对象语言中，一个运用了模板方法模式的程序中，子类的方法种类和执行顺序都是不变的，所以我们把这部分逻辑抽象到父类的模板方法里面。而子类的方法具体怎么实现则是可变的，于是我们把这部分变化的逻辑封装到子类中。通过增加新的子类，我们便能给系统增加新的功能，并不需要改动抽象父类以及其他子类，这也是符合开放封闭原则的。

`我们很多时候都不需要依样画瓢地去实现一个模版方法模式，高阶函数是更好的选择`。

结构组成：

1. 抽象父类：封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序
2. 实现子类：继承抽象父类，继承整个算法结构，并且可以选择重写父类的方法

```js
// 模板方法模式
// 抽象父类
// 子类继承父类之后，父类通知子类执行这些方法
var Beverage = function () { };

// 具体方法
Beverage.prototype.boilWater = function () {
    console.log('把水煮沸')
}
// 抽象方法
Beverage.prototype.brew = function () {
    // 子类方法实现检测
    throw new Error('子类必须重写brew方法')
}
Beverage.prototype.pourInCup = function () {
    throw new Error('子类必须重写pourInCup方法')
}
Beverage.prototype.addCondiments = function () {
    throw new Error('子类必须重写addCondiments方法')
}
// 挂钩，修改默认行为
Beverage.prototype.customerWantsCondiments = function () {
    // 默认需要调料
    return true
}

// 模板，控制方法调用与方法执行顺序
Beverage.prototype.init = function () {
    this.boilWater();
    this.brew();
    this.pourInCup();
    // 如果挂钩返回true，则需要调料
    if(this.customerWantsCondiments()){
        this.addCondiments()
    }
}

// 实现子类，继承父类抽象方法并具体实现该方法
var CoffeeWithHook = function(){};
// 继承父类
CoffeeWithHook.prototype = new Beverage();
// 实现父类抽象方法
CoffeeWithHook.prototype.brew = function(){
    console.log('用沸水冲泡咖啡')
}
CoffeeWithHook.prototype.pourInCup = function(){
    console.log('把咖啡倒进杯子')
}
CoffeeWithHook.prototype.addCondiments = function(){
    console.log('加糖和牛奶')
}
// 修改父类模板默认行为
CoffeeWithHook.prototype.customerWantsCondiments = function(){
    return window.confirm('请问需要调料吗？')
}

var coffeeWithHook = new CoffeeWithHook();
coffeeWithHook.init();

```

```js
// 高阶函数
var Beverage = function(param){
    var boilWater = function(){
        console.log('把水煮沸')
    }
    var brew = param.brew || function(){
        throw new Error('必须传递brew方法')
    }
    var pourInCup = param.pourInCup || function(){
        throw new Error('必须传递pourInCup方法')
    }
    var addCondiments = param.addCondiments || function(){
        throw new Error('必须传递addCondiments方法')
    }

    var F = function(){};
    F.prototype.init = function(){
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }
    return F;
}

var Coffee = Beverage({
    brew:function(){
        console.log('用沸水冲泡咖啡')
    },
    pourInCup:function(){
        console.log('把咖啡倒进杯子')
    },
    addCondiments:function(){
        console.log('加糖和牛奶')
    },
})

var coffee = new Coffee();
coffee.init();
```

## 享元模式

享元（flyweight）模式是一种用于性能优化的模式
适用场景：

1. 一个程序中使用了大量的相似对象
2. 由于使用了大量对象，造成很大的内存开销
3. 剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象
4. 对象的大多数状态都可以变为外部状态

享元模式要求将对象的属性`划分为内部状态与外部状态`（状态在这里通常指属性）。享元模式的目标是尽量减少共享对象的数量，关于如何划分内部状态和外部状态，下面的几条经验提供了一些指引。

1. 内部状态存储于对象内部
2. 内部状态可以被一些对象共享
3. 内部状态独立于具体的场景，通常不会改变
4. 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

```js
// 享元模式-文件上传


var Upload = function (uploadType) {
    // 内部状态，可共享
    this.uploadType = uploadType
}
Upload.prototype.delFile = function (id) {
    uploadManager.setExternalState(id, this);
    if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('确认要删除该文件吗？' + this.fileName)) {
        return this.dom.parentNode.removeChild(this.dom)
    }
}
var UploadFactory = (function () {
    var createdFlyWeightObjs = {};
    return {
        create: function (uploadType) {
            if (createdFlyWeightObjs[uploadType]) {
                return createdFlyWeightObjs[uploadType]
            }
            return createdFlyWeightObjs[uploadType] = new Upload(uploadType)
        }
    }
})()

var uploadManager = (function () {
    var uploadDatabase = {};
    return {
        add: function (id, uploadType, fileName, fileSize) {
            var flyWeightObj = UploadFactory.create(uploadType);

            var dom = document.createElement('div');

            dom.innerHTML = '<span>文件名称:' + this.fileName + ', 文件大小: ' + this.fileSize + '</span>' +
                '<button class="delFile">删除</button>';

            dom.querySelector('.delFile').onclick = function () {
                flyWeightObj.delFile(id)
            }

            document.body.appendChild(dom);
            // 外部状态
            uploadDatabase[id] = {
                fileName: fileName,
                fileSize: fileSize,
                dom: dom
            }

            return flyWeightObj;
        },
        setExternalState: function (id, flyWeightObj) {
            var uploadData = uploadDatabase[id];
            for (var i in uploadData) {
                flyWeightObj[i] = uploadData[i]
            }
        }
    }
})()

var id = 0;
window.startUpload = function (uploadType, files) {
    for (var i = 0, file; file = files[i++];) {
        var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
    }
}

startUpload('plugin', [
    {
        fileName: '1.txt',
        fileSize: 1000
    },
    {
        fileName: '2.txt',
        fileSize: 3000
    },
    {
        fileName: '3.txt',
        fileSize: 4000
    },
    {
        fileName: '4.txt',
        fileSize: 5000
    },
])
startUpload('flash', [
    {
        fileName: '5.txt',
        fileSize: 1000
    },
    {
        fileName: '6.txt',
        fileSize: 3000
    },
    {
        fileName: '7.txt',
        fileSize: 4000
    },

])
```

## 订阅-发布模式

发布 — 订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。在 JavaScript开发中，我们一般用事件模型来替代传统的发布 — 订阅模式

优点：1.在时间上解耦（可用在异步编程），2.在对象之间解耦
缺点：

1. 消耗内存：创建订阅者本身要消耗一定的时间和内存，而且当订阅一个消息后，可能该消息不会发生，但是这个订阅者会始终存在于内存中。
2. 过渡使用导致难以维护和理解：如果过渡使用，对象与对象之间的必要联系也被埋藏在背后，会导致程序难以跟踪维护和理解

```js
let Event = (function () {

    let _default = 'default';

    return function () {
        let _listen,
            _trigger,
            _remove,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {},
            _create,

            each = function (ary, fn) {
                let ret;
                for (var i = 0, l = ary.length; i < l; i++) {
                    let n = ary[i];
                    ret = fn.call(n, i, n)
                }
                return ret;
            }
        _listen = function (key, fn, cache) {
            if (!cache[key]) {
                cache[key] = []
            }
            cache[key].push(fn);
        }
        _remove = function (key, cache, fn) {
            if (cache[key]) {
                if (fn) {
                    for (let i = cache[key].length; i >= 0; i--) {
                        if (cache[key][i] === fn) {
                            cache[key].splice(i, 1);
                        }
                    }
                } else {
                    cache[key] = []
                }
            }
        }
        _trigger = function () {
            let cache = _shift.call(arguments),
                key = _shift.call(arguments),
                args = arguments,
                _self = this,
                ret,
                stack = cache[key];

            if (!stack || !stack.length) {
                return;
            }
            return each(stack, function () {
                return this.apply(_self, args)
            })
        }
        _create = function (namespace) {
            var namespace = namespace || _default;
            let cache = {},
                offlinesStack = [],// 离线事件
                ret = {
                    listen(key, fn, last) {
                        _listen(key, fn, cache);
                        if (offlinesStack === null) {
                            return;
                        }
                        if (last === 'last') {
                            offlinesStack.length && offlinesStack.pop()();
                        } else {
                            each(offlinesStack, function () {
                                this();
                            })
                        }
                        offlinesStack = null;
                    },
                    one(key, fn, last) {
                        _remove(key, cache);
                        this.listen(key, fn, last)
                    },
                    remove(key, fn) {
                        _remove(key, cache, fn)
                    },
                    trigger() {
                        let fn, args, _self = this;
                        _unshift.call(arguments, cache);
                        args = arguments;
                        fn = function () {
                            return _trigger.apply(_self, args);
                        }

                        if (offlinesStack) {
                            return offlinesStack.push(fn)
                        }
                        return fn();
                    }
                }
            return namespace ? (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret) : ret;
        }
        return {
            create: _create,
            one(key, fn, last) {
                let event = this.create();
                event.one(key, fn, last)
            },
            remove(key, fn) {
                let event = this.create();
                event.remove(key, fn)
            },
            listen(key, fn, last) {
                let event = this.create();
                event.listen(key, fn, last)
            },
            trigger() {
                let event = this.create();
                event.trigger.apply(this, arguments);
            }
        }
    }();
})()

Event.trigger('click', 1);
Event.listen('click', function (a) {
    console.log(a)
})

Event.create('namespace1').listen('click', function (a) {
    console.log(a)
})
Event.create('namespace1').trigger('click', 1)
Event.create('namespace2').listen('click', function (a) {
    console.log(a)
})
Event.create('namespace2').trigger('click', 2)

// 1 1 2
```

## 开放-封闭原则

软件实体（类、模块、函数）等应该是可以扩展的，但是不可修改

- 过多的条件分支语句是造成程序违反开放封闭原则的一个常见原因
- 通过封装变化的方式，可以把系统中稳定不变的部分和容易变化的部分隔离开来。
- `放置挂钩（hook）`也是分离变化的一种方式。我们在程序有可能发生变化的地方放置一个挂
钩，挂钩的返回结果决定了程序的下一步走向。这样一来，原本的代码执行路径上就出现了一个
分叉路口，程序未来的执行方向被预埋下多种可能性。
- `回调函数`是一种特殊的挂钩。我们可以把一部分易于变化的逻辑封装在回调函数里，然后把
回调函数当作参数传入一个稳定和封闭的函数中。当回调函数被执行的时候，程序就可以因为回
调函数的内部逻辑不同，而产生不同的结果。

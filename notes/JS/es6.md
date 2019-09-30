# ES6 语法
## ES6 字符串新增方法
### includes()，startsWith()，endsWith()
- `includes()` 返回布尔值，表示找到了参数字符串,第二个参数表示开始搜索的位置
- `startsWith()` 返回布尔值，表示参数字符串是否在原字符串的头部，第二个参数表示开始搜索的位置
- `endsWith()` 放回布尔值，表示参数字符串是否在原字符串的尾部，第二个参数表示结束搜索的位置

```js
let s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true
```
```js
let s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```
### padStart()，padEnd()
字符串补全长度的功能
- `padStart()` 用于头部补全，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。
- `padEnd()` 用于尾部补全，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。

`padStart()`的常见用途是为数值补全指定位数
```js
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"
```
`padStart()`另一个用途是提示字符串格式
```js
'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```
::: warning 注意
* 如果原字符串的长度，`等于`或`大于`最大长度，则字符串`补全不生效`，返回原字符串。 
```js
'xxx'.padStart(2, 'ab') // 'xxx'
'xxx'.padEnd(2, 'ab') // 'xxx'
```
* 如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，则会`截去超出位数`的补全字符串。
```js
'abc'.padStart(10, '0123456789')
// '0123456abc'
```
* 如果省略第二个参数，默认使用`空格补全`长度。
```js
'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '
```
:::

### trimStart()，trimEnd()
它们的行为与`trim()`一致,`trimStart()`消除字符串`头部的空格`，`trimEnd()`消除`尾部的空格`   
它们对`tab 键`、`换行符`等`不可见的空白符号`也有效，返回的都是`新字符串`，不会修改原始字符串。

## Decorator 修饰器 （@）
### 类的修饰
修改类行为
```js
/*
*   类修饰器
*   @param {Object} target 被修饰的类的本身
*/
decoratorFnName (target)
```
::: tip 
注意，修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时
:::
### 方法的修饰
修饰类的属性
```js
/*
*   方法修饰器
*   @param {Object} target 被修饰类的原型对象
*   @param {String} name 被修饰的属性名
*   @param {Object} descriptor 被修饰的属性描述对象
*/
decoratorFnName (target,name,descriptor)
```
* 修饰器（readonly）会修改属性的描述对象（descriptor），然后被修改的描述对象再用来定义属性。  
* 如果同一个方法有多个修饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行
```js
function dec(id){
  console.log('evaluated', id);
  return (target, property, descriptor) => console.log('executed', id);
}

class Example {
    @dec(1)
    @dec(2)
    method(){}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```
::: tip 提示
ES5中提供了一个读取属性的特性的方法 [Object.getOwnPropertyDescriptor()](./es5.html#object-getownpropertydescriptor) ,可以读取给定属性的描述符。
* 访问器属性:`configurable`、`enumerable`、`get`、`set`
* 数据属性：`configurable`、`enumerable`、`writable`、`value`
:::

## Proxy 代理器
Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

```js
/**
 * @param {Object} target 拦截的目标对象
 * @param {Object} handler 定制拦截行为
 **/
var proxy = new Proxy(target, handler);
```
* 要使得Proxy起作用，必须针对`Proxy实例`（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。
* 如果`handler`没有设置任何拦截，那就等同于直接通向原对象。
* Proxy 实例也可以作为其他对象的原型对象
* 同一个拦截器函数，可以设置拦截多个操作

Proxy 支持的拦截操作一览，一共 13 种。
1. **get(target, propKey, receiver)**：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
2. **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
3. **has(target, propKey)**：拦截`propKey in proxy`的操作，返回一个布尔值。
4. **deleteProperty(target, propKey)**：拦截`delete proxy[propKey]`的操作，返回一个布尔值。
5. **ownKeys(target)**：拦截`Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
6. **getOwnPropertyDescriptor(target, propKey)**：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
7. **defineProperty(target, propKey, propDesc)**：拦截`Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
8. **preventExtensions(target)**：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
9. **getPrototypeOf(target)**：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
10. **isExtensible(target)**：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
11. **setPrototypeOf(target, proto)**：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
12. **apply(target, object, args)**：拦截 `Proxy` 实例作为函数调用的操作，比如`proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)`。
13. **construct(target, args)**：拦截 `Proxy` 实例作为构造函数调用的操作，比如`new proxy(...args)`。

## Reflect
设计目的：
1. 将`Object`对象的一些明显属于语言内部的方法（例如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。也就是说，从`Reflect`对象上可以拿到语言内部的方法。
2. 修改某些`Object`方法的返回结果，让其变得更加合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。
```js
// 老写法
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```
3. 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。
```js
// 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assign') // true
```
4. `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。
```js
Proxy(target, {
  set: function(target, name, value, receiver) {
    var success = Reflect.set(target, name, value, receiver);
    if (success) {
      console.log('property ' + name + ' on ' + target + ' set to ' + value);
    }
    return success;
  }
});
```
有了Reflect对象以后，很多操作会更易读
```js
// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1

// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1
```
Reflect对象一共有 13 个静态方法。
* Reflect.apply(target, thisArg, args)
* Reflect.construct(target, args)
* Reflect.get(target, name, receiver)
* Reflect.set(target, name, value, receiver)
* Reflect.defineProperty(target, name, desc)
* Reflect.deleteProperty(target, name)
* Reflect.has(target, name)
* Reflect.ownKeys(target)
* Reflect.isExtensible(target)
* Reflect.preventExtensions(target)
* Reflect.getOwnPropertyDescriptor(target, name)
* Reflect.getPrototypeOf(target)
* Reflect.setPrototypeOf(target, prototype)

## 使用 Proxy 实现观察者模式
观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。
```js
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);

// observable函数返回一个原始对象的 Proxy 代理，拦截赋值操作，触发充当观察者的各个函数
const observable = obj => new Proxy(obj, {set});

// 所有观察者函数都放进这个集合
function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}

const person = observable({
  name: '张三',
  age: 20
});

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print);
person.name = '李四';
// 输出
// 李四, 20
```

## Set 和 Map 数据结构

### Set
`Set`它类似于数组，但是成员的值都是唯一的，没有重复的值。Set本身是一个构造函数，用来生成 Set 数据结构。

### Set 实例的属性和方法
属性
- `Set.prototype.constructor`：构造函数，默认就是Set函数。
- `Set.prototype.size`：返回Set实例的成员总数

方法
- `add(value)`：添加某个值，返回 Set 结构本身。
- `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
- `has(value)`：返回一个布尔值，表示该值是否为Set的成员。
- `clear()`：清除所有成员，没有返回值。

遍历方法
- `keys()`：返回键名的遍历器
- `values()`：返回键值的遍历器
- `entries()`：返回键值对的遍历器
- `forEach()`：使用回调函数遍历每个成员

### Set应用

```js
// 去除数组的重复成员
[...new Set(array)]

// 去除字符串里面的重复字符
[...new Set('ababbc')].join('')
// "abc"

// Array.from方法可以将 Set 结构转为数组
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);

// 去除数组重复成员
function dedupe(array) {
  return Array.from(new Set(array));
}

dedupe([1, 1, 2, 3]) // [1, 2, 3]
```
### WeakSet
与Set类似，也是不重复的值的集合，但有两个区别：
1. WeakSet的成员只能是对象，不能是其他类型的值
2. WeakSet中的对象都是弱引用

方法：
- `WeakSet.prototype.add(value)`：向 WeakSet 实例添加一个新成员
- `WeakSet.prototype.delete(value)`：清除 WeakSet 实例的指定成员
- `WeakSet.prototype.has(value)`：返回一个布尔值，表示某个值是否在 WeakSet 实例之中

::: tip
弱引用：如果其他对象都不引用该对象，那么垃圾回收机制会自动收回该对象所占用的内存，不考虑该对象还存在于弱引用中。

*弱引用的对象不能被遍历*
:::

### Map
JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。为了解决这个问题，ES6 提供了 `Map` 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，`各种类型的值（包括对象）都可以当作键`。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

### Map实例的属性和操作方法

- `size` 属性：返回 Map 结构的成员总数
- `set(key,value)`：set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。`可以采用链式写法`
- `get(key)`：读取key对应的键值，如果找不到key，返回undefined。
- `has(key)`：返回一个布尔值，表示某个键是否在当前 Map 对象之中
- `delete(key)`：删除某个键，返回true。如果删除失败，返回false
- `clear()`：清除所有成员，没有返回值。

遍历方法
- `keys()`：返回键名的遍历器。
- `values()`：返回键值的遍历器。
- `entries()`：返回所有成员的遍历器。
- `forEach()`：遍历 Map 的所有成员。

### Map与其他数据结构转换
Map转数组
```js
const map = new Map().set({a:10},[10,12]).set(true,110);
const arr = [...map];
```
数组转Map
```js
new Map([[true,10],[{foo:10},[10,12]]])
```
Map转对象
```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }
```
对象转为 Map
```js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}
```
Map 转为 JSON
```js
// 一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)
// '{"yes":true,"no":false}'

// 另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON。
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'
```
JSON 转为 Map
```js
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}


function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
// Map {true => 7, Object {foo: 3} => ['abc']}
```

### WeakMap
WeakMap结构与Map结构类似，也是用于生成键值对的集合。
WeakMap与Map的区别有两点

- WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
- WeakMap的键名所指向的对象，不计入垃圾回收机制
- WeakMap只有四个方法：`get()、set()、has()、delete()`


适用场景：如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap

::: warning
注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。
```js
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};

wm.set(key, obj);
obj = null;
wm.get(key)
// Object {foo: 1}
```
:::

示例：
```js
let myElement = document.getElementById('logo');
let myWeakmap = new WeakMap();

myWeakmap.set(myElement, {timesClicked: 0});

myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
}, false);
```
上面代码中，myElement是一个 DOM 节点，每当发生click事件，就更新一下状态。我们将这个状态作为键值放在 WeakMap 里，对应的键名就是myElement。一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险。
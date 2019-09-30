# ES5
## Object.defineProperty
要修改属性默认的特性
```js
/*
*   改属性默认的特性
*   @param {Object} target 属性所在的对象
*   @param {String} name 属性的名字
*   @param {String} descriptor 描述符对象(必须是 configurable：一但定义为不可配置之后就不能改为可配置 、 enumerable 、 writable 和 value)
*/
Object.defineProperty(target,name,descriptor)
```
## Object.defineProperties
定义多个属性
```js
/*
*   定义多个属性
*   @param {Object} targetObject 要添加/修改其属性的目标对象
*   @param {String} value 添加或修改的属性值
*   @return {Object} 
*/
Object.defineProperties(targetObject,value)
```
## Object.getOwnPropertyDescriptor
读取属性的特性
```js
/*
*   读取属性的特性的方法
*   @param {Object} object 属性所在对象
*   @param {String} name 属性名
*   @return {Object} 
*/
Object.getOwnPropertyDescriptor(object,name)
```
* 访问器属性:`configurable`、`enumerable`、`get`、`set`
* 数据属性：`configurable`、`enumerable`、`writable`、`value`

示例
```js
var book = {};
Object.defineProperties(book,{
    _year:{ value: 2019 },
    edition:{ value: 1 },
    year:{
        get:function(){
            return this._year;
        },
        set:function(newValue){
            if(newValue > 2019){
                this._year = newValue;
                this.edition += newValue - 2019;
            }
        }
    }
})

var descriptor = Objec.getOwnPropertyDescriptor(book,"_year");
console.log(descriptor.value);  //2019
console.log(descriptor.configurable);  //false
console.log(typeof descriptor.get);  //"undefined"
var descriptor = Objec.getOwnPropertyDescriptor(book,"year");
console.log(descriptor.value);  //"undefined"
console.log(descriptor.enumerable);  //false
console.log(typeof descriptor.get);  //"function"
```
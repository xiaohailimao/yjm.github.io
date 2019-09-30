// Set数据结构
// const array1 = [...new Set([1,2,3,3,2,1])];
// console.log(array1);
// const str = [...new Set('abccba')].join('');
// console.log(str);

// let set = new Set(['red', 'green', 'blue']);

// for(let i of set.keys()){
//     console.log(i)
// }
// for(let i of set.values()){
//     console.log(i)
// }
// for(let i of set.entries()){
//     console.log(i)
// }
// set.forEach((value,key)=>{
//     console.log(key+':'+value)
// })

// console.log(set.size)
// set.add('black')
// console.log(set.has('red'),set)
// console.log(set.delete('red'),set)

// Map数据结构
// let map = new Map();
// let obj = { a:10 }

// console.log(map.set(obj,'this is obj value'),map.size,map.get(obj),map.has(obj),map,map.delete(obj))

// const map = new Map().set({a:10},[10,12]).set(true,110);
// const arr = [...map];
// console.log(arr);

// console.log(new Map([[true,7],[{a:10},[10,12]]]))

// var mult = function(){
//     console.log('开始计算乘积');
//     var a = 1;
//     for(var i=0,l=arguments.length;i<l;i++){
//         a = a * arguments[i]
//     }
//     return a;
// }

// var proxyMult = function(){
//     var cache = {};
//     return function(){
//         var args = Array.prototype.join.call(arguments,',');
//         if(args in cache){
//             return cache[args]
//         }
//         return cache[args] = mult.apply(this,arguments);
//     }
// }()

// console.log(proxyMult(1,2,3,4)); //输出：24
// console.log(proxyMult(1,2,3,4)); //输出：24

// var Folder = function (name) {
//     this.name = name;
//     this.files = [];
// }
// Folder.prototype.add = function (file) {
//     console.log(file)
//     this.files.push(file)
// }
// Folder.prototype.scan = function () {
//     console.log('开始扫描文件夹：' + this.name);
//     for (var i = 0, file, files = this.files; file = files[i++];) {
//         file.scan()
//     }
// }

// var File = function (name) {
//     this.name = name
// }
// File.prototype.add = function () {
//     throw new Error('文件下面不能再添加文件')
// }
// File.prototype.scan = function () {
//     console.log('开始扫描文件：' + this.name);
// }

// var folder = new Folder('学习资料');
// var folder1 = new Folder('JavaScript');
// var folder2 = new Folder('JQuery');

// var file1 = new File('JavaScript设计模式与开发实践');
// var file2 = new File('精通JQuery');
// var file3 = new File('重构与模式');

// folder1.add(file1);
// folder2.add(file2);

// folder.add(folder1);
// folder.add(folder2);
// folder.add(file3);

// var folder3 = new Folder('Nodejs');
// var file4 = new File('深入浅出Node.js');

// var file5 = new File('JavaScript语言精髓与编程实践');

// folder.add(folder3);
// folder.add(file5);
// folder.scan();

//  [
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

// var id = 0;
// window.startUpload = function (uploadType, file) {
//     for (var i = 0, file; file = files[i++];) {
//         var uploadObj = new uploadObj(uploadType, file.name, fileSize);
//         uploadObj.init(id++);
//     }
// }
// var Upload = function (uploadType, fileName, fileSize) {
//     this.uploadType = uploadType;
//     this.fileName = fileName;
//     this.fileSize = fileSize;
//     this.dom = null;
// }

// Upload.prototype.init = function (id) {
//     var that = this;
//     this.id = id;
//     this.dom = document.createElement('div');
//     this.dom.innerHTML = '<span>文件名称:' + this.fileName + ', 文件大小: ' + this.fileSize + '</span>' +
//         '<button class="delFile">删除</button>';
//     this.dom.querySelector('.deFile').onclick = function () {
//         that.delFile();
//     }
//     document.body.appendChild(this.dom);
// }
// Upload.prototype.delFile = function(){
//     if(this.fileSize<3000){
//         return this.dom.parentNode.removeChild(this.dom);
//     }
//     if(window.confirm('确认要删除该文件吗？'+this.fileName)){
//         return this.dom.parentNode.removeChild(this.dom)
//     }
// }

/********************************* */
// function foo() { console.log( a ); // 2
// }
// function bar() { var a = 3;
// foo(); }
// var a = 2; bar();


// try { throw 2; } catch (a) {
//     console.log(a); // 2
// }
// console.log(a); // ReferenceErrorø

// var LoginController = {
//     error:["404"],
//     getUser(){
//         console.log(this)
//         console.log("get user info")
//     },
//     getPassword(){
//         console.log("get password")
//     }
// }
// var AuthController = {
//     error:["无效token"],
//     checkAuth(){
//         console.log("check auth")
//     },
//     server(url,data){}
// }
// Object.setPrototypeOf(AuthController,LoginController)
// AuthController.getUser()
// console.log(AuthController.error[0])

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
    var btn1 = Object.create(Button);
    btn1.setup(125, 30, "Hello")
    var btn2 = Object.create(Button);
    btn2.setup(150, 40, 'word')
    btn1.render($body);
    btn2.render($body);
})
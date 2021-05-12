---
title: 数据结构
date: 2021-02-02
tags: 
- 数据结构
categories: 
- 文章
---

## 重点关注

数据结构与算法的特点、应用场景、JS实现、时间/空间复杂度

## 基础理论
### 数据结构

- 栈、队列、链表
- 集合、字典
- 树、堆、图

### 算法

- 链表：遍历链表、删除链表节点
- 树、图：深度/深
- 数组：冒泡/选择/插入/归并/快速排序、书序/二分搜索

### 时间复杂度

- 一个函数，用大O表示，比如O(1),O(n),O(logN)
- 定性描述该算法的运行时间

![时间复杂度](/img/时间复杂度.png)

O(1)
``` JS
let i = 0
i += 1
```

O(n)
``` JS
for(let i = 0; i < n; i++){
  console.log(i)
}
```

O(1)+O(n) = O(n)
```js
let i = 0
i += 1
for(let j = 0; j < n; j++){
  console.log(j)
}
```

O(n) * O(n) = O(n^2)
``` JS
for(let i = 0; i < n; i++){
  for(let j = 0; j < n; j++){
    console.log(i,j)
  }
}
```

O(logN)
``` JS
let i = 1
while(i < n){
  console.log(i)
  i *= 2
}
```

### 空间复杂度

- 一个函数，用大O表示，比如O(1),O(n),O(n^2)
- 算法在运行过程中临时暂用存储空间大小的度量

O(1)
``` JS
let i = 0
i += 1
```

O(n)
``` JS
let arr = []
for(let i = 0; i< n ; i++){
  arr.push(i)
}
```

O(n^2)
``` JS
const matrix = []; // 二维数组
for(let i = 0; i< n ; i++){
  matrix.push([])
  for(let j = 0; j< n ; j++){
    matrix[i].push(j)
  }
}
```

### 栈

- **后进先出，push/pop**

使用场景
- 所有先进后出的场景
- 十进制转二进制
![十进制转二进制](/img/十进制转二进制.png)
- 判断字符串的括号是否有效
![判断字符串的括号是否有效](/img/验证字符串括号是否有效.png)
![字符串是否合法解题思路](/img/字符串是否合法解题思路.png)
```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const len = s.length
    if(len % 2 === 1){ return false }
    
    const stack = []
    for(let i =0;i<len;i++){
        const c = s[i]
        if(c === '(' || c === '[' || c === '{'){
            stack.push(c)
        }else {
            const t = stack[stack.length - 1]
            if(
                (t === '(' && c === ')') ||
                (t === '[' && c === ']') ||
                (t === '{' && c === '}')
            ){
                stack.pop()
            }else {
                return false
            }
        }
    }

    return stack.length === 0
};
```
- 函数调用堆栈
![函数调用堆栈](/img/函数调用堆栈.png)
- [二叉树的前序遍历 leetcode](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)
``` JS
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    const res = []
    const stack = []
    if(root){ stack.push(root) }
    
    while(stack.length){
        const n = stack.pop()
        res.push(n.val)
        if(n.right){ stack.push(n.right) }
        if(n.left){ stack.push(n.left) }
    }
    
    return res
};
```
总结

- 栈是一个后进先出的数据结构
- JavaScript没有栈，但是可以通过Array实现栈的所有功能
- 常用栈操作：push、pop、stack[stack.lengt -1]

### 队列

- **先进先出的数据结构**
- JavaScript没有栈，但是可以通过Array实现队列的所有功能

使用场景

- 所有先进先出，保证有序性的场景
- 食堂打饭
- js异步中的任务队列
![js异步中的任务队列](/img/js中的异步任务队列.png)
- [计算最近请求次数]()
![计算最近请求次数](/img/计算最近请求次数.png)
```js
var RecentCounter = function() {
  this.queue = []
};

/** 
 * @param {number} t
 * @return {number}
 */
RecentCounter.prototype.ping = function(t) {
    this.queue.push(t)

    while(this.queue[0] < t - 3000){
      this.queue.shift()
    }
    
    return this.queue.length
};

/**
 * Your RecentCounter object will be instantiated and called as such:
 * var obj = new RecentCounter()
 * var param_1 = obj.ping(t)
 */
```

### 链表

- 多个元素组成的列表
- 元素的存储不连续，用next指针连着一起
![链表](/img/链表.png)
- JavaScript没有，用Object实现链表

数组 vs 链表

- 数组：增删非首尾元素时往往需要移动元素
- 链表：增删非首尾元素，不需要移动元素，只需要修改next的指向即可

链表在js中创建方法
``` JS {11-15}
const a = { val: 'a' }
const b = { val: 'b' }
const c = { val: 'c' }
const d = { val: 'd' }

a.next = b
b.next = c
c.next = d

// 遍历链表
let point = a // 先定义一个指针指向链表
while(point){
  console.log(point.val)
  point = point.next // 遍历移动指针
}

// 插入
const e = { val: 'e' }
// 在c和d直接插入e
c.next = e
e.next = d

// 删除, 删除 e
c.next = d
```

使用场景
- [删除链表中的节点](https://leetcode-cn.com/problems/delete-node-in-a-linked-list/)
![删除链表中的节点](/img/删除链表中的节点解题思路.png)
- 将被删除节点的值改为下个节点的值
- 删除下个节点
``` JS
var deleteNode = function(node) {
    node.val = node.next.val // 将被删除节点的值改为下个节点的值
    node.next = node.next.next // 删除下个节点
};
```
- [反转链表](https://leetcode-cn.com/problems/reverse-linked-list/)
![反转链表解题思路](/img/反转链表解题思路.png)
``` JS
var reverseList = function(head) {
    let p1 = head
    let p2 = null
    while(p1){
        const n = p1.next
        p1.next = p2
        p2 = p1
        p1 = n
    }
    return p2
};
```
- [环形链表](https://leetcode-cn.com/problems/linked-list-cycle/)
- 原型链

``` JS
// 指针遍历 __proto__ 和链表相似
const instanceof = (a,b) => {
  let p = a
  while(p){
    if(p === b.prototype){
      return true
    }
    p = p.__proto__
  }
  return false
}
```
- 使用链表的指针获取json的节点值
``` JS
const json = {
  a:{ b: { c: 1 } },
  d: { e: 2 }
}

const path = ['a','b','c']

let p = json // 定义指针，指向json数据对象
path.forEach(k=>{
  p = p[k] // 遍历移动指针
})

console.log(p) // 1
```

总结

- JS中的原型链也是一个链表
- 使用链表的指针可以获取json的节点值

### 集合 Set

- 一种**无序且唯一**的数据结构
- ES6的集合：Set
- 集合的常规操作
  - 去重
  ``` JS
  const arr = [1,1,2,2]
  const arr2 = [...new Set(arr)]
  ```
  - 判断元素是否在集合中
  ``` JS
  const arr = [1,1,2,2]
  const set = new Set(arr)
  const has = set.has(1) // true
  ```
  - 求交集
  ``` JS
  const set1 = new Set([1,1,2,2,3])
  const set2 = new Set([1,2])
  const set3 = new Set([...set1].filter(item => set2.has(item))) // 交集
  ```

### 字典 Map
- 与集合类似，字典也是一种存储唯一值的数据结构，但它是以**键值对**的形式来存储
``` JS
const map = new Map()
// 增、改 都用 set
map.set('a','aaa')
// 删除指定键值对
map.delete('a')
// 清空
mao.clear()
// 查
map.get('a')
```

### 树

- 一种**分层**数据的抽象模型
- 前端常见树：DOM树、级联选择、树形控件
- 常用操作
  - 深度/深
  - 先中后序遍历
#### BFS 广度优先遍历（队列）

- 新建一个队列，把根节点入队
- 把队头出队并访问
- 把队头的children挨个入队
- 重复第二三部，直到队列为空

``` JS
const bfs = root => {
  const q = [root] // 新建一个队列，把根节点入队
  while(q.length > 0){
    // 把队头出队并访问
    const n = q.shift()
    console.log(n.val)

    // 把队头的children挨个入队
    n.children.forEach(child => q.push(child))
  }
}
```


遇到”层次“就要想到”扫描“，想到扫描就要想到BFS，运用队列，先进先出，访问过的就出队

二叉树的层序遍历

``` JS
function bfs(root) {
  
  const queue = [root] // 列队

  // 列队不为空，说明遍历还没结束
  while(queue.length){
    // 取出队头元素
    const top = queue.shift()
    // 访问top
    console.log(top.val)
    // 如果左子树存在，左子树入队
    if(top.left){
      queue.push(top.left)
    }
    // 如果右子树存在，右子树入队
    if(top.right){
      queue.push(top.right)
    }
  }
}

```


#### DFS 深度优先遍历(递归)

- 访问根节点
- 对根节点的children挨个进行深度优先遍历

``` JS
const dfs = root => {
  console.log(root.val); // 访问根节点
  root.children.forEach(dfs) // 递归 对根节点的 children 挨个进行深度优先遍历
}
```


”穷举“，“遍历”，“递归”，dfs与二叉树的先序遍历类似 根 => 左子 => 右子树

二叉树遍历
``` JS
// 所有的遍历函数的入参都是树的根节点对象
function dfs(root){
  // 递归边界
  if(!root){
    return
  }
  // 输出当前遍历的结点值
  console.log('当前遍历的结点值是：', root.val)
  // 递归遍历左子树
  dfs(root.left)
  // 递归遍历右子树
  dfs(root.right)
}
```

#### 遍历json的所有节点
``` JS
const json = {
  a: { b: { c: 1 } },
  d: [1, 2]
}

const dfs = (n,path) => {
  console.log(n,path)
  Object.keys(n).forEach(k=>{
    dfs(n[k],path.concat(k))
  })
}

dfs(json,[])
```

#### 树形目录
``` JS
const json = [
  {
    title: "a",
    key: 1,
    children:[
      {
        title: "c",
        key: 3,
        children:[]
      }
    ],
    {
      title: "b",
      key: 2,
      children:[]
    }
  }
]

import React from "react"

class Tree extends React.Component {
  dfs = n => {
    return (
      <TreeNode title={n.title} key={n.key}>
      { n.children.map(this.dfs) }
      </TreeNode>
    )
  }
  render(){
    return <Tree>{json.map(this.dfs)}</Tree>
  }
}

export default Tree
```

### 二叉树

- 树中每个节点最多只能有两个节点
- 在js中用Object模拟二叉树

中序遍历、后序遍历都是和先序遍历代码一样，只不过在哪个阶段处理目标数据的的问题

- 在遍历左子树、右子树之前处理目标数据就是先序遍历：根 => 左子树 => 又子树
- 在遍历左子树、右子树中间处理目标数据就是中序遍历：左子树 => 根 => 又子树
- 在遍历左子树、右子树之后处理目标数据就是后序遍历：左子树 => 又子树 => 根
#### 先序遍历

- 访问根节点
- 对根节点的**左子**树进行先序遍历
- 对根节点的**右子**树进行先序遍历

先序遍历： 根 => 左子树 => 又子树

递归版
``` JS
const preorder = root => {
  if(!root){ return }
  console.log(root.val) // 访问根节点
  preorder(root.left) // 对根节点的左子树进行先序遍历
  preorder(root.right) // 对根节点的右子树进行先序遍历
}
```

堆栈版
``` JS
const preorder = root => {
  if(!root){ return }
  const stack = [root]
  while (stack.length) {
    const n = stack.pop()
    console.log(n.val) // 访问根节点
    if(n.right){ stack.push(n.right) } 
    if(n.left){ stack.push(n.left) } // 堆栈的特点后进先出，需要把需要先执行的后面入栈，保证执行顺序
  }
}
```
#### 中序遍历

- 对根节点的**左子**树进行中序遍历
- 访问根节点
- 对根节点的**右子**树进行中序遍历

中序遍历： 左子树 => 根 => 又子树

递归版
``` JS
const inorder = root => {
  if(!root){ return }
  inorder(root.left) // 对根节点的左子树进行中序遍历
  console.log(root.val) // 访问根节点
  inorder(root.right) // 对根节点的右子树进行中序遍历
}
```

堆栈版
``` JS
const inorder = root => {
  if(!root){ return }
  const stack = []
  let p = root
  while (stack.length || p) {
    // 1. 遍历所有的左节点，把所有的左指针都先入栈
    while (p) {
      stack.push(p)
      p = p.left
    }
    const n = stack.pop()
    console.log(n.val) // 访问根节点
    p = n.right // 访问右节点，重新遍历走逻辑
  }
}
```
#### 后序遍历

- 对根节点的**左子**树进行后序遍历
- 对根节点的**右子**树进行后序遍历
- 访问根节点

后序遍历： 左子树 => 又子树 => 根

递归版
``` JS
const postorder = root => {
  if(!root){ return }
  postorder(root.left) // 对根节点的左子树进行后序遍历
  postorder(root.right) // 对根节点的右子树进行后序遍历
  console.log(root.val) // 访问根节点
}
```

堆栈版
``` JS
const postorder = root => {
  if(!root){ return }
  const stack = []
  const outputStack = []
  while (stack.length) {
    const n = stack.pop()
    outputStack.push(n) // 利用先序逻辑把根节点推入栈
    if(n.left){ stack.push(n.left) } 
    if(n.right){ stack.push(n.right) } 
  }
  while (outputStack.length) {
    const n = outputStack.pop() // 反向拿取根节点，就完成后序遍历
    console.log(n.val) // 访问根节点
  }
}
```

### 图

![图](/img/图.png)
- JavaScript中没有图，可以用Object和Array构建图
- 常用操作
  - 深度优先遍历
  ![图深度优先遍历](/img/图深度优先遍历.png)
  ``` JS
  // 邻接表数据
  const graph = {
    0: [1,2],
    1: [2],
    2: [0,3]
    3: [3]
  }

  const visited = new Set()

  const dfs = n => {
    console.log(n) // 访问节点
    visited.add(n) // 记录是否访问过
    graph[n].map(c => {
      if(!visited.has(c)){
        dfs(c) // 递归遍历
      }
    })
  }

  dfs(2)
  ```
  - 广度优先遍历
  ![图广度优先遍历](/img/图广度优先遍历.png)
  ``` JS
  // 邻接表数据
  const graph = {
    0: [1,2],
    1: [2],
    2: [0,3]
    3: [3]
  }

  const visited = new Set()
  visited.add(2)
  let q = [2]

  while (q.length) {
    const n = q.shift()
    console.log(n)
    graph[n].map(c => {
      if(!visited.has(c)){
        q.push(c)
        visited.add(c) // 记录是否访问过
      }
    })
  }
  ```
  
#### 图的表示法

![邻接表](/img/邻接表.png)
![邻接矩阵](/img/邻接矩阵.png)
关联矩阵

### 堆

![js中的堆](/img/js中的堆.png)
## JS中排序和搜索

- JS中的排序：数组的sort方法
- JS中的搜索：数组的indexOf方法
- 排序算法：
  - 冒泡排序
  - 选择排序
  - 插入排序
  - 归并排序
  - 快速排序
- 搜索算法
  - 顺序搜索
  - 二分搜索

## 分而治之

- **算法设计**中的一种方法
- 它将一个问题**分**成多个和原问题相识的小问题，**递归解决**小问题，再将**结果合并**以解决原来的问题

### 场景

- 归并排序
  - 分：把数组从中间一分为二
  - 解：递归地对两个子数组进行归并排序
  - 合：合并有序子数组

- 快速排序
  - 分：选基准，按基准把数组分成两个子数组
  - 解：递归地对两个子数组进行归并排序
  - 合：对两个子数组进行合并

## 动态规划

- **算法设计**中的一种方法
- 它将一个问题分解为**相互重叠**的子问题，通过反复求解子问题，来解决原来的问题

## 贪心算法

- **算法设计**中的一种方法
- 期盼通过每个阶段的**局部最优**选择，从而达到全局的最优
- 结果并**不一定是最优**

## 回溯算法

- **算法设计**中的一种方法
- 回溯算法是一种渐进式寻找并构建问题解决方式的策略
- 回溯算法会从一个可能的动作开始解决问题，如果不行，就回溯并选择另一个动作，直到将问题解决
- 什么问题适合使用回溯算法解决
  - 有很多路
  - 这些路里，有死路，也有出路
  - 通常需要用递归来模拟所有的路
- ![全排列](/img/全排列.png)
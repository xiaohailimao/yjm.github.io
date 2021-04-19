---
title: 数据结构
date: 2021-02-02
tags: 
- 数据结构
categories: 
- 文章
---

## BFS 广度优先遍历

遇到”层次“就要想到”扫描“，想到扫描就要想到BFS，运用队列，先进先出，访问过的就出队

二叉树的层序遍历

``` JS
function bfs(root) {
  
  const queue = [] // 列队
  queue.push(root) // 更节点首先入队

  // 列队不为空，说明遍历还没结束
  while(queue.length){
    // 取出队头元素
    const top = queue[0]
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
    // 访问完毕，队头元素出队
    queue.shift()
  }
}

```


## DFS 深度优先遍历

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

## 二叉树递归遍历三种方法

先序遍历： 根 => 左子树 => 又子树

dfs与先序遍历类似
``` JS
// 所有的遍历函数的入参都是树的根节点对象
function dfs(root){
  // 递归边界
  if(!root){
    return
  }
  // 输出当前遍历的结点值，这个位置处理目标数据为先序遍历
  console.log('当前遍历的结点值是：', root.val)
  // 递归遍历左子树
  dfs(root.left)
  // 输出当前遍历的结点值，这个位置处理目标数据为中序遍历
  // ...
  // 递归遍历右子树
  dfs(root.right)
  // 输出当前遍历的结点值，这个位置处理目标数据为后序遍历
  // ...
}
```
中序遍历、后序遍历都是和先序遍历代码一样，只不过在哪个阶段处理目标数据的的问题

- 在遍历左子树、右子树之前处理目标数据就是先序遍历：根 => 左子树 => 又子树
- 在遍历左子树、右子树中间处理目标数据就是中序遍历：左子树 => 根 => 又子树
- 在遍历左子树、右子树之后处理目标数据就是后序遍历：左子树 => 又子树 => 根

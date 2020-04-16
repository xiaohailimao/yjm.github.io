---
title: vuex
date: 2018-01-01
tags:
  - Vuex
categories:
  - 文档
---

## state

- 单一状态树，用一个对象就包含了全部的应用层级状态（唯一数据源）。
- 每个应用将仅仅包含一个 store 实例。
- 单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

### 组件中获取 vuex

根组件“注入”到每个子组件中，通过`this.$store`访问

```js
const app = new Vue({
  el: "#app",
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `,
});
```

### mapState 辅助函数

使用 mapState 函数生成计算属性

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from "vuex";

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: (state) => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: "count",

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState(state) {
      return state.count + this.localCount;
    },
  }),
};
```

当映射的计算属性的名称与 state 的子节点名称相同时，也可以给 mapState 传一个字符串数组。

```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  "count",
]);
```

对象展开运算符(推荐)

```js
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
```

## mutation

- 同步提交更改状态，是更新状态的唯一方法
- mutation 必须是同步函数，异步函数回调会导致状态改变不可追踪，因为当 mutation 触发的时候，回调函数还没有被调用，_实质任何在回调函数中进行的状态的改变都是不可追踪的_
- 每个 mutation 都有一个字符串的事件类型（type）和一个回调函数（handler）
- 回调函数 handler 接受 state 作为第一个参数，额外参数作为提交载荷 payload

### 提交

```js
// payload 应该为一个对象，可以包含多个字段记录的mutation会更易读
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

提交方式

```js
store.commit({
  type: "increment",
  amount: 10,
});
```

```js
store.commit("increment", { amount: 10 });
```

### Mutation 需要遵守 vue 的响应规则

1. 最好提前在 store 中初始化好所有所需属性
2. 当需要再对象上添加新属性时

- 使用 Vue.set(obj,'newProp',123)
- 以新对象替换老对象

```js
state.obj = { ...state.obj, newProp: 123 };
```

### 使用常量代替 Mutation 事件类型

```js
// mutation-types.js
export const SOME_MUTATION = "SOME_MUTATION";
```

```js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

### mapMutation 辅助函数

需要在根节点注入 store

```js
import { mapMutations } from "vuex";

export default {
  // ...
  methods: {
    ...mapMutations([
      "increment", // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      "incrementBy", // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: "increment", // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    }),
  },
};
```

## action

主要用于异步操作，提交的是 mutation（通过 dispatch 提交）

- action 函数接受一个与 store 实例具有相同方法与属性的 context 对象（不是 store 实例本身）

```js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### 分发 Action

分发方式

```js
// 以载荷形式分发
store.dispatch("incrementAsync", {
  amount: 10,
});

// 以对象形式分发
store.dispatch({
  type: "incrementAsync",
  amount: 10,
});
```

调用异步 API 和分发多重 mutation

```js
actions: {
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

在组件中的分发

```js
import { mapActions } from "vuex";

export default {
  // ...
  methods: {
    ...mapActions([
      "increment", // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      "incrementBy", // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: "increment", // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    }),
  },
};
```

### 组合 Action

store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise,并且 store.dispatch 仍旧返回 Promise

```js
// actionA
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

```js
store.dispatch("actionA").then(() => {
  // ...
});
```

```js
// actionB
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

利用 async / await

```js
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

::: tip
一个 store.dispatch 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。
:::

## getters

类似 vue 中的 computed，就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

- Getter 接受 `state` 作为其`第一个`参数
- Getter 接受 其他 `Getter` 作为其`第二个`参数

### 属性访问

Getter 会暴露为 `store.getters` 对象，你可以以属性的形式访问这些值

```js
store.getters.doneTodos; // -> [{ id: 1, text: '...', done: true }]
```

Getter 也可以接受其他 `getter` 作为第二个参数：

```js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length;
  };
}
```

### 方法访问

你也可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的`数组进行查询`时非常有用。

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find((todo) => todo.id === id);
  };
}
```

```js
store.getters.getTodoById(2); // -> { id: 2, text: '...', done: false }
```

### mapGetters 辅助函数

mapGetters 辅助函数仅仅是将 store 中的 getter `映射到局部计算属性`

```js
import { mapGetters } from "vuex";

export default {
  // ...
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      "doneTodosCount",
      "anotherGetter",
      // ...
    ]),
  },
};
```

将一个 getter 属性另取一个名字，使用对象形式

```js
mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: "doneTodosCount",
});
```

## module

每个模块拥有自己的 `state、mutation、action、getter`、甚至是嵌套子模块——从上至下进行同样方式的分割：

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

### 模块的局部状态

对于模块内部的 mutation 和 getter，接收的第一个参数是模块的局部状态对象。

```js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment(state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++;
    },
  },

  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
};
```

对于模块内部的 action，局部状态通过 context.state 暴露出来，根节点状态则为 context.rootState

```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit("increment");
      }
    },
  },
};
```

对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：

```js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount(state, getters, rootState) {
      return state.count + rootState.count;
    },
  },
};
```

### 命名空间

## 表单处理

当在严格模式中使用 Vuex 时，在属于 Vuex 的 `state` 上使用 `v-model` 会比较棘手：

```html
<input v-model="obj.message" />
```

假设这里的 obj 是在计算属性中返回的一个属于 Vuex store 的对象，在用户输入时，v-model 会试图直接修改 obj.message。在严格模式中，由于这个修改不是在 mutation 函数中执行的, 这里会抛出一个错误。

mutation 函数：

```js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### 解决方案-vuex 思维

```html
<input :value="message" @input="updateMessage" />
```

```js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

### 解决方案-双向绑定的属性计算

```html
<input v-model="message" />
```

```js
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```

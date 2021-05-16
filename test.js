function reactive(target = {}) {
  // 不是对象或数组，则返回
  if (typeof target !== 'object' || target == null) {
    return target
  }

  const proxyConfig = {
    get(target, key, receiver) {
      const ownkeys = Reflect.ownKeys(target)
      if (ownkeys.includes(key)) {
        console.log('get', key); // 监听
      }

      const result = Reflect.get(target, key, receiver)
      // 深度监听
      return reactive(result)
    },
    set(target, key, val, receiver) {
      // 重复数据不处理
      if (val === target[key]) {
        return true
      }

      const ownkeys = Reflect.ownKeys(target)
      if (ownkeys.includes(key)) {
        console.log('set', key); // 监听修改
      } else {
        console.log('add', key); // 监听新增
      }

      const result = Reflect.set(target, key, val, receiver)
      // 深度监听
      return result
    },
    defineProperty(target, key) {
      console.log('defineProperty', key); // 监听删除
      const result = Reflect.defineProperty(target, key)
      return result
    }
  }

  const observed = new Proxy(target, proxyConfig)
  return observed
}

const data = {
  name: "xx",
  age: 20,
  info: {
    city: "xiamen"
  }
}

const proxyData = reactive(data)

console.log(proxyData.name);
console.log(proxyData.info.city);
proxyData.age = 30
delete proxyData.name

const tree = {
  val: 'a',
  children: [
    {
      val: 'b',
      children: [
        {
          val: 'd',
          children: []
        },
        {
          val: 'e',
          children: []
        }
      ]
    },
    {
      val: 'c',
      children: [
        {
          val: 'f',
          children: []
        },
        {
          val: 'g',
          children: []
        }
      ]
    }
  ]
}


const dfs = root => {
  console.log(root.val);
  root.children.forEach(dfs)
}

// dfs(tree)

const bfs = root => {
  const q = [root] // 
  while (q.length > 0) {
    const n = q.shift()
    console.log(n.val)
    n.children.forEach(child => q.push(child))
  }
}

bfs(tree)

// function getDictDataApi({type}){

//   axios.post('xxx',{params:{type}}).then(res=>{

//   })
// }
const state = {
  data: {} // 字典数据对象
}

const mutations = {
  SET_DATA(state, payload) {
    state.data = { ...state.data, ...payload }
  }
}

const actions = {
  getData({ commit, type }) {
    getDictDataApi({ type })
      .then(res => {
        commit('SET_DATA', res)
      })
      .catch(err => {
        console.log(err);
      })
  }
}

export default {
  namespance: true,
  state,
  mutations,
  actions,
}
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建一个 vuex 容器实例，用来存储需要在组件之间共享的状态
export default new Vuex.Store({
  // state 用于存储需要在组件间共享的数据
  // 这里的数据是响应式的，可以被任意组件访问
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  // 更改 state 中的状态的唯一方法是提交 mutation
  mutations: {
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 通过本地存储，将 user 进行数据持久化
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {},
  modules: {}
})

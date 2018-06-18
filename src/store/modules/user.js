const state = {
  user: JSON.parse(window.localStorage.getItem('chat_user')) || {},
  targetList: JSON.parse(window.localStorage.getItem('chat_targetList')) || []
}
const getters = {
  user: state => state.user,
  targetList: state => state.targetList,
  targetInfo: state => {
    const obj = {}
    state.targetList.forEach(item => {
      obj[item._id] = {
        name: item.username,
        avatar: item.avatar
      }
    })
    return obj
  }
}
const mutations = {
  setUser: (state, user) => {
    state.user = user
    window.localStorage.setItem('chat_user', JSON.stringify(user))
  },
  setTargetList: (state, list) => {
    state.targetList = list
    window.localStorage.setItem('chat_targetList', JSON.stringify(list))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}

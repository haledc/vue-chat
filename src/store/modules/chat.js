const state = {
  chatMsg: JSON.parse(window.localStorage.getItem('chat_chatMsg')) || []
}
const getters = {
  chatMsg: state => state.chatMsg,
  msgList: state => {
    const obj = {}
    state.chatMsg.forEach(item => {
      obj[item.chatId] = obj[item.chatId] || []
      obj[item.chatId].push(item)
    })
    return Object.values(obj).sort((arr1, arr2) => {
      const time1 = arr1[arr1.length - 1].create_time
      const time2 = arr2[arr2.length - 1].create_time
      return time2 - time1
    })
  }
}
const mutations = {
  setChatMsg: (state, list) => {
    state.chatMsg = list
    window.localStorage.setItem('chat_chatMsg', JSON.stringify(list))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}

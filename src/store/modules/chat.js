import api from '../../assets/api'
import {LocalStorage} from 'quasar'

const state = {
  chatMsg: LocalStorage.get.item('chat_chatMsg') || []
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
    LocalStorage.set('chat_chatMsg', list)
  }
}

const actions = {
  getChatMsg: ({commit}) => {
    api.getChatMsg()
      .then(data => {
        if (data.status === 0) {
          commit('setChatMsg', data.result)
        }
      })
  },
  readMsg: ({commit}, {from}) => {
    api.readMsg(from)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

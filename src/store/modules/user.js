import api from '../../assets/api'
import {LocalStorage} from 'quasar'

const state = {
  user: LocalStorage.get.item('chat_user') || {},
  targetList: LocalStorage.get.item('chat_targetList') || []
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
  setTargetList: (state, list) => {
    state.targetList = list
    LocalStorage.set('chat_targetList', list)
  },
  doLogin: (state, userInfo) => {
    state.user = userInfo
    LocalStorage.set('chat_user', userInfo)
  }
}

const actions = {
  login: ({commit}, {username, password}) => {
    return new Promise((resolve, reject) => {
      api.login(username, password)
        .then(data => {
          commit('doLogin', data)
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  register: ({commit}, {username, password, type}) => {
    api.register(username, password, type)
  },
  updateInfo: ({commit}, updateData) => {
    return new Promise((resolve, reject) => {
      api.updateInfo(updateData)
        .then(data => {
          commit('doLogin', data)
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getTargetList: ({commit}, type) => {
    api.getTargetList(type)
      .then(data => {
        commit('setTargetList', data)
      })
  },
  logout: ({commit}) => {
    api.logout()
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

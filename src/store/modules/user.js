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
          if (data.status === 0) {
            commit('doLogin', data.result)
          }
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  register: ({commit}, {username, password, type}) => {
    return new Promise((resolve, reject) => {
      api.register(username, password, type)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateInfo: ({commit}, updateData) => {
    return new Promise((resolve, reject) => {
      api.updateInfo(updateData)
        .then(data => {
          if (data.status === 0) {
            commit('doLogin', data.result)
          }
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
        if (data.status === 0) {
          commit('setTargetList', data.result)
        }
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

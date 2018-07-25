import api from '../../assets/api'

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
  setTargetList: (state, list) => {
    state.targetList = list
    window.localStorage.setItem('chat_targetList', JSON.stringify(list))
  },
  doLogin: (state, userInfo) => {
    state.user = userInfo
    window.localStorage.setItem('chat_user', JSON.stringify(userInfo))
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

import axios from 'axios'

import {createError} from '../utils'

const request = axios.create({
  baseURL: '/user'
})

const handleRequest = (request) => {
  return new Promise((resolve, reject) => {
    request
      .then(res => {
        const data = res.data
        if (!data) {
          return reject(createError(400, 'no result'))
        }
        if (!data.success) {
          // reject(createError(400, data.message))
          resolve({
            status: 1,
            message: data.message
          })
        }
        resolve({
          status: 0,
          result: data.result
        })
      })
      .catch(err => {
        const res = err.response
        if (res.status === 401) {
          reject(createError(401, 'need auth'))
        }
      })
  })
}

export default {
  login(username, password) {
    return handleRequest(request.post('/login', {username, password}))
  },
  register(username, password, type) {
    return handleRequest(request.post('/register', {username, password, type}))
  },
  updateInfo(updateData) {
    return handleRequest(request.post('/updateInfo', updateData))
  },
  getTargetList(type) {
    return handleRequest(request.get('/list', {params: {type}})) // 注意：params是一个对象
  },
  logout() {
    return handleRequest(request.post('/logout'))
  },
  getChatMsg() {
    return handleRequest(request.get('/chatMsg'))
  },
  readMsg(from) {
    return handleRequest(request.post('/readMsg', {from}))
  }
}

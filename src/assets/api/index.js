import axios from 'axios'

const request = axios.create({
  baseURL: '/user'
})

export default {
  login (username, password) {
    return request.post('/login', { username, password })
  },
  register (username, password, type) {
    return request.post('/register', { username, password, type })
  },
  updateInfo (updateData) {
    return request.post('/updateInfo', updateData)
  },
  getTargetList (type) {
    return request.get('/list', { params: { type } }) // 注意：params是一个对象
  },
  logout () {
    return request.post('/logout')
  },
  getChatMsg () {
    return request.get('/chatMsg')
  },
  readMsg (from) {
    return request.post('/readMsg', { from })
  }
}

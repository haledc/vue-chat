import VueSocketio from 'vue-socket.io'

const URL = process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:9092' : 'http://chat.haledeng.com'

// leave the export, even if you don't use it
export default ({ Vue }) => {
  Vue.use(VueSocketio, URL)
}

import VueSocketio from 'vue-socket.io'

const PORT = process.env.PORT || 9092

// leave the export, even if you don't use it
export default ({Vue}) => {
  Vue.use(VueSocketio, `http://127.0.0.1:${PORT}`)
}

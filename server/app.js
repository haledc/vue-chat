const Koa = require('koa')
const bodyParse = require('koa-bodyparser')
const logger = require('koa-logger')
const serve = require('koa-static')
const path = require('path')
const history = require('koa2-connect-history-api-fallback')

const routers = require('./routes')
require('./database/index')

const app = new Koa()
const server = require('http').Server(app.callback())
const Chat = require('./database/models/chat')
const io = require('socket.io')(server)

io.on('connection', async socket => {
  socket.on('sendMsg', data => {
    const { from, to, msg } = data
    console.log(data)
    const chatId = [from, to].sort().join('_')
    Chat.create({ chatId, from, to, content: msg }, (err, doc) => {
      if (err) throw err
      io.emit('receiveMsg', Object.assign({}, doc._doc))
    })
  })
})

app.use(history())
app.use(logger())
app.use(bodyParse())
app.use(serve(path.join(__dirname, './static')))

app.use(routers.routes()).use(routers.allowedMethods())

const PORT = process.env.PORT || 9092

server.listen(PORT, () => {
  console.log(`Server running at port http://127.0.0.1:${PORT} at ${new Date()}`)
})

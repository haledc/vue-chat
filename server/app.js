const Koa = require('koa')
const bodyParse = require('koa-bodyparser')
const logger = require('koa-logger')
const serve = require('koa-static')
const path = require('path')
const history = require('koa2-connect-history-api-fallback')

const routers = require('./routes')
require('./db/index')

const app = new Koa()
const server = require('http').Server(app.callback())
const Chat = require('./db/models/chat')
const io = require('socket.io')(server)

io.on('connection', async socket => {
  socket.on('sendMsg', data => {
    const {from, to, msg} = data
    const chatId = [from, to].sort().join('_')
    Chat.create({chatId, from, to, content: msg}, (err, doc) => {
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
  console.log(`Server Start at port ${PORT} at ${new Date()}`)
})

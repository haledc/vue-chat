const Koa = require('koa')
const bodyParse = require('koa-bodyparser')
const logger = require('koa-logger')

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

app.use(logger())
app.use(bodyParse())

app.use(routers.routes()).use(routers.allowedMethods())

server.listen(3000, () => {
  console.log(`Server Start at port 3000 at ${new Date()}`)
})

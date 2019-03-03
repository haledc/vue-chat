const Router = require('koa-router')
const User = require('../database/models/user')
const Chat = require('../database/models/chat')
const { successResponse, failureResponse, md5Pwd } = require('../utils')

const router = new Router({ prefix: '/user' })

// 查询信息隐藏字段
const findFilter = {
  password: 0,
  __v: 0
}

router.post('/register', async ctx => {
  const { username, password, type } = ctx.request.body
  const exist = await User.findOne({ username })
  if (exist) {
    failureResponse(ctx, 200, '用户名重复,请重新输入或者去登录！')
    return
  }
  const newUser = new User({ username, password: md5Pwd(password), type })
  const user = await newUser.save()
  const { _id } = user
  ctx.cookies.set('userId', _id, {
    httpOnly: false
  })
  successResponse(ctx, { _id })
})

router.post('/updateInfo', async ctx => {
  const updateData = ctx.request.body
  const userId = ctx.cookies.get('userId')
  const user = await User.findByIdAndUpdate(userId, updateData)
  const { username, type } = user
  const data = Object.assign(
    {},
    {
      username,
      type
    },
    updateData
  )
  successResponse(ctx, data)
})

router.get('/list', async ctx => {
  const { type } = ctx.query
  const userList = await User.find({ type }, findFilter)
  successResponse(ctx, userList)
})

router.post('/logout', async ctx => {
  ctx.cookies.set('userId', '', {
    path: '/',
    maxAge: -1
  })
  ctx.body = successResponse('注销成功')
})

router.post('/login', async ctx => {
  const { username, password } = ctx.request.body
  const user = await User.findOne({
    username
  })
  if (!user) {
    failureResponse(ctx, 200, '用户不存在')
  } else {
    const match = await User.findOne({
      username,
      password: md5Pwd(password)
    })
    if (match) {
      ctx.cookies.set('userId', user._id, {
        httpOnly: false
      })
      successResponse(ctx, match)
    } else {
      failureResponse(ctx, 200, '用户名或者密码不正确！')
    }
  }
})

router.get('/chatMsg', async ctx => {
  const userId = ctx.cookies.get('userId')
  const chat = await Chat.find({
    $or: [{ from: userId }, { to: userId }]
  })
  successResponse(ctx, chat)
})

router.post('/readMsg', async ctx => {
  const userId = ctx.cookies.get('userId')
  const { from } = ctx.request.body
  const chat = await Chat.update(
    { from, to: userId },
    {
      $set: {
        isRead: true
      }
    },
    {
      multi: true
    }
  )
  successResponse(ctx, {
    num: chat.nModified
  })
})

module.exports = router

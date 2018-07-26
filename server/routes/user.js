const Router = require('koa-router')
const User = require('../db/models/user')
const Chat = require('../db/models/chat')
const utility = require('utility')

const router = new Router({prefix: '/user'})

// 查询信息隐藏字段
const findFilter = {
  password: 0,
  __v: 0
}

const successResponse = data => {
  return {
    success: true,
    result: data
  }
}

const errorResponse = msg => {
  return {
    success: false,
    message: msg
  }
}

router.post('/register', async ctx => {
  try {
    const {username, password, type} = ctx.request.body
    const exist = await User.findOne({username})
    if (exist) {
      ctx.body = errorResponse('用户名重复,请重新输入或者去登录！')
      return
    }

    const userModel = new User({username, password: md5Pwd(password), type})
    const user = await userModel.save()
    const {_id} = user
    ctx.cookies.set('userId', _id, {
      httpOnly: false
    })
    ctx.body = successResponse({_id})
  } catch (err) {
    ctx.status = 500
    ctx.body = errorResponse(err.message)
  }
})

router.post('/updateInfo', async ctx => {
  try {
    const updateData = ctx.request.body
    const userId = ctx.cookies.get('userId')
    const user = await User.findByIdAndUpdate(userId, updateData)
    const data = Object.assign({}, {
      username: user.username,
      type: user.type
    }, updateData)
    ctx.body = successResponse(data)
  } catch (err) {
    ctx.status = 500
    ctx.body = errorResponse(err.message)
  }
})

router.get('/list', async ctx => {
  try {
    const {type} = ctx.query
    const userList = await User.find({type}, findFilter)
    ctx.body = successResponse(userList)
  } catch (err) {
    ctx.status = 500
    ctx.body = errorResponse(err.message)
  }
})

router.post('/logout', async ctx => {
  ctx.cookies.set('userId', '', {
    path: '/',
    maxAge: -1
  })
  ctx.body = successResponse('注销成功')
})

router.post('/login', async ctx => {
  try {
    const {username, password} = ctx.request.body
    const user = await User.findOne({
      username,
      password: md5Pwd(password)
    }, findFilter)
    if (user) {
      ctx.cookies.set('userId', user._id, {
        httpOnly: false
      })
      ctx.body = successResponse(user)
    } else {
      ctx.body = errorResponse('用户名或者密码不正确！')
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = errorResponse(err.message)
  }
})

router.get('/chatMsg', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const chat = await Chat.find({
      '$or': [
        {from: userId},
        {to: userId}
      ]
    })
    ctx.body = successResponse(chat)
  } catch (err) {
    ctx.status = 500
    ctx.body = errorResponse(err.message)
  }
})

router.post('/readMsg', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const {from} = ctx.request.body
    console.log(from, ctx.request.body)
    const chat = await Chat.update({from, to: userId}, {
      '$set': {
        isRead: true
      }
    }, {
      multi: true
    })
    ctx.body = successResponse({
      num: chat.nModified
    })
  } catch (err) {
    ctx.status = 500
    ctx.body = errorResponse(err.message)
  }
})

function md5Pwd(pwd) {
  const salt = 'hale_vue_koa_mongoose_#$%^&*!@'
  return utility.md5(utility.md5(pwd + salt))
}

module.exports = router

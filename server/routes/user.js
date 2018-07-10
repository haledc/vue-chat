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

router.post('/register', async ctx => {
  try {
    const {username, password, type} = ctx.request.body
    const exist = await User.findOne({username})
    if (exist) {
      ctx.body = {
        status: 1,
        msg: '用户名重复'
      }
      return
    }

    const userModel = new User({username, password: md5Pwd(password), type})
    const user = await userModel.save()
    const {username1, type1, _id} = user
    // ctx.cookies.set('userId', _id, {
    //   httpOnly: false
    // })
    ctx.body = {
      status: 0,
      result: {username1, type1, _id}
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }

})

router.post('/update', async ctx => {
  try {
    const updateData = ctx.request.body
    const userId = ctx.cookies.get('userId')
    const user = await User.findByIdAndUpdate(userId, updateData)
    const data = Object.assign({}, {
      username: user.username,
      type: user.type
    }, updateData)
    ctx.body = {
      status: 0,
      result: data
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

router.get('/list', async ctx => {
  try {
    const {type} = ctx.query
    const userList = await User.find({type}, findFilter)
    ctx.body = {
      status: 0,
      result: userList
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

router.get('/info', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    if (!userId) {
      ctx.body = {
        status: 1
      }
      return
    }
    const user = await User.findOne({_id: userId}, findFilter)
    ctx.body = {
      status: 0,
      result: user
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

router.post('/logout', async ctx => {
  ctx.cookies.set('userId', '', {
    path: '/',
    maxAge: -1
  })
  ctx.body = {
    status: 0
  }
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
      ctx.body = {
        status: 0,
        result: user,
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '用户名或者密码不正确！'
      }
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

router.get('/chatMsg', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const usersDoc = await User.find()
    let users = {}
    usersDoc.forEach(item => {
      users[item._id] = {name: item.username, avatar: item.avatar}
    })
    const chat = await Chat.find({
      '$or': [
        {from: userId},
        {to: userId}
      ]
    })
    ctx.body = {
      status: 0,
      result: {
        chat,
        users
      }
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

router.post('/readMsg', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const {from} = ctx.request.body
    console.log(from)
    const chat = await Chat.update({from, to: userId}, {
      '$set': {
        isRead: true
      }
    }, {
      multi: true
    })
    console.log(chat)
    ctx.body = {
      status: 0,
      result: {
        num: chat.nModified
      }
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

function md5Pwd(pwd) {
  const salt = 'hale_vue_koa_mongoose_#$%^&*!@'
  return utility.md5(utility.md5(pwd + salt))
}

module.exports = router

const router = require('koa-router')()

const user = require('./user')

router.use(user.routes()).use(user.allowedMethods())

module.exports = router
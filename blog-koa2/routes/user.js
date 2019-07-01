const { login } = require('../controller/user')
const { ErrorModel, SuccessModel } = require('../model')
const router = require('koa-router')()

router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const data = await login(username, password)
  if (data.username) {
    ctx.session.username = data.username
    ctx.session.realName = data.realname

    ctx.body = new SuccessModel(ctx.session)

  } else {
    ctx.body = new ErrorModel('登录失败啦')
  }
})

router.get('/session-test', function (ctx, next) {
  if (!ctx.session.viewCount) {
    ctx.session.viewCount = 0
  }
  ctx.session.viewCount++

  ctx.body = {
    errno: 0,
    viewCount: ctx.session.viewCount
  }
})

module.exports = router

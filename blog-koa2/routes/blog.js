const { ErrorModel, SuccessModel } = require('../model')
const loginCheck = require('../middleware/loginCheck')
const router = require('koa-router')()

const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''

  // 管理员页面发起的请求
  if (ctx.query.isadmin) {
    if (!ctx.session.username) {
      ctx.body = new ErrorModel('未登录')
      return
    }

    author = ctx.session.username
  }

  const listData = await getList(author, keyword)
  ctx.body = new SuccessModel(listData)
})

router.get('/detail', async (ctx, next) => {
  const id = ctx.query.id || ''
  const data = await getDetail(id)
  ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async (ctx, next) => {
  const blogData = ctx.request.body
  blogData.author = ctx.session.username
  const data = await newBlog(ctx.request.body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async (ctx, next) => {
  const id = ctx.query.id || ''
  const updateData = await updateBlog(id, ctx.request.body)
  if (updateData) {
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('更新博客失败')
  }
})

router.post('/del', loginCheck, async (ctx, next) => {
  const id = ctx.query.id || ''
  const author = ctx.session.username
  const data = await delBlog(id, author)
  if (data) {
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('删除博客失败')
  }
})

module.exports = router

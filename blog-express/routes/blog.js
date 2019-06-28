var express = require('express')
const { SuccessModel, ErrorModel } = require('../model')
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')

var router = express.Router()

router.get('/list', (req, res, next) => {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''

  // 管理员页面发起的请求
  if (req.query.isadmin) {
    if (!req.session.username) {
      res.json(
        new ErrorModel('未登录')
      )
      return
    }

    author = req.session.username
  }

  const result = getList(author, keyword)
  return result.then((listData) => {
    res.json(new SuccessModel(listData))
  })
})

router.get('/detail', (req, res, next) => {
  const id = req.query.id || ''
  const result = getDetail(id)
  return result.then((data) => {
    res.json(new SuccessModel(data))
  })
})

router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  return result.then(data => {
    res.json(
      new SuccessModel(data)
    )
  })
})

router.post('/update', loginCheck, (req, res, next) => {
  const id = req.query.id || ''
  const result = updateBlog(id, req.body)
  return result.then((updateData) => {
    if (updateData) {
      res.json(
        new SuccessModel()
      )
    } else {
      res.json(
        new ErrorModel('更新博客失败')
      )
    }
  })
})

router.post('/del', loginCheck, (req, res, next) => {
  const id = req.query.id || ''
  const author = req.session.username
  const result = delBlog(id, author)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('删除博客失败'))
    }
  })
})

module.exports = router

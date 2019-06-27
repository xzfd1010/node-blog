var express = require('express')
const { SuccessModel } = require('../model')
const { getList, getDetail } = require('../controller/blog')

var router = express.Router()

router.get('/list', function (req, res, next) {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''

  // 管理员页面发起的请求
  // if (req.query.isadmin) {
  //   const loginCheckResult = loginCheck(req)
  //   if (loginCheckResult) {
  //     return loginCheckResult
  //   }
  //
  //   author = req.session.username
  // }

  const result = getList(author, keyword)
  return result.then((listData) => {
    res.json(new SuccessModel(listData))
  })
})

router.get('/detail', function (req, res, next) {
  const id = req.query.id || ''
  const result = getDetail(id)
  return result.then((data) => {
    res.json(new SuccessModel(data))
  })
})

module.exports = router

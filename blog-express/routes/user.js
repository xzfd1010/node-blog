var express = require('express')
const { login } = require('../controller/user')
const { ErrorModel, SuccessModel } = require('../model')
var router = express.Router()

router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  const result = login(username, password)
  return result.then(data => {
    if (data.username) {

      req.session.username = data.username
      req.session.realName = data.realname

      res.json(
        new SuccessModel(req.session)
      )
    } else {
      res.json(
        new ErrorModel('登录失败啦')
      )
    }
  })
})

// router.get('/login-test', (req, res, next) => {
//   if (req.session.username) {
//     res.json({
//       errno: 0,
//       msg: '测试成功'
//     })
//     return
//   }
//   res.json({
//     errno: -1,
//     msg: '未登录'
//   })
// })
// router.get('/session-test', (req, res, next) => {
//   const session = req.session
//   if (session.viewNum == null) {
//     session.viewNum = 0
//   }
//   session.viewNum++
//
//   res.json({
//     viewNum: session.viewNum
//   })
// })

module.exports = router

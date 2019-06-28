const {SuccessModel, ErrorModel} = require('../model')
const {login} = require('../controller/user')
const {set} = require('../db/redis')

const userServerHandler = (req, res) => {
  const method = req.method
  if (method === 'POST' && req.path === '/api/user/login') {
    const {username, password} = req.body
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {

        req.session.username = data.username
        req.session.realName = data.realname

        set(req.sessionId, req.session) // 保存到session中

        return new SuccessModel(req.session)
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }

  if (method === 'GET' && req.path === '/api/user/login-check') {
    // 这里的作用是用来模拟，需要检测登录的接口，可以通过req.session.username是否存在判断用户是否登录
    if (req.session.username) {
      return Promise.resolve(
        new SuccessModel({
          session: req.session
        }))
    } else {
      return Promise.resolve(
        new ErrorModel('登录失败')
      )
    }
  }
}

module.exports = userServerHandler
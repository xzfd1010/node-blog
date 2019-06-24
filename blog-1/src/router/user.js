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
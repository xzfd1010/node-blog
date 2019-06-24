const {SuccessModel, ErrorModel} = require('../model')
const {login} = require('../controller/user')

const userServerHandler = (req, res) => {
  const method = req.method
  if (method === 'GET' && req.path === '/api/user/login') {
    const {username, password} = req.query
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {

        req.session.username = data.username
        req.session.realName = data.realname

        console.log(`username:${req.session.username},realName:${req.session.realName}`)

        return new SuccessModel()
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }

  if (method === 'GET' && req.path === '/api/user/login-check') {
    console.log('session', req.session)
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
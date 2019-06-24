const {SuccessModel, ErrorModel} = require('../model')
const {loginCheck} = require('../controller/user')
const userServerHandler = (req, res) => {
  const method = req.method
  if (method === 'POST' && req.path === '/api/user/login') {
    const {username, password} = req.body
    const result = loginCheck(username, password)
    return result.then(data => {
      if (data.username) {
        return new SuccessModel()
      } else {
        return new ErrorModel('登录失败')
      }
    })

  }
}

module.exports = userServerHandler
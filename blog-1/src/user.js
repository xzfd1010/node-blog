const userServerHandler = (req, res) => {
  const method = req.method
  if (method === 'POST' && req.path === '/api/user/login') {
    return {
      msg: '用户登录成功'
    }
  }
}

module.exports = userServerHandler
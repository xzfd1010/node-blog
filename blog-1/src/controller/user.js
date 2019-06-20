const loginCheck = (username, password) => {
  // mock数据
  if (username === 'Nick' && password === '123') {
    return true
  }
  return false
}

module.exports = {loginCheck}
const crypto = require('crypto')

const SCERET_KEY = 'nibuzhidaodemimayou'

function md5 (password) {
  const hash = crypto.createHash('md5')
  return hash.update(password).digest('hex')
}

function genPassword (password) {
  const str = `password=${password}&&SECRET_KEY=${SCERET_KEY}`
  return md5(str)
}

module.exports = {genPassword}
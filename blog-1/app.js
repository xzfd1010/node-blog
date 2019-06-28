const blogServerHandler = require('./src/router/blog')
const userServerHandler = require('./src/router/user')
const querystring = require('querystring')
const {access} = require('./src/utils/log')
const {get, set} = require('./src/db/redis')

// const SESSION_DATA = {}

const setExpire = () => {
  const date = new Date()
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000)
  // console.log('GMT', date.toISOString())
  return date.toISOString()
}

const getPostData = (req) => {

  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  return new Promise((resolve, reject) => {
    // 判断方法
    if (req.method !== 'POST') {
      return resolve({})
    }
    // 这里的content-type只能用[]写法，不能用驼峰
    if (req.headers['content-type'] !== 'application/json') {
      return resolve({})
    }
    let postData = ''
    req.on('data', (data) => {
      postData += data.toString()
    })
    req.on('end', () => {
      if (!postData) return resolve({})
      resolve(JSON.parse(postData))
    })
  })
}

const serverHandler = (req, res) => {
  const url = req.url
  req.path = url.split('?')[0]
  res.setHeader('Content-type', 'application/json')

  req.query = querystring.parse(url.split('?')[1])

  // 解析cookie
  const cookie = {}

  const cookieStr = req.headers.cookie || ''
  const cookieArr = cookieStr.split(';')
  cookieArr.map(item => {
    if (!item) return
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    cookie[key] = val
  })

  req.cookie = cookie

  // 解析session
  // let needSetCookie = false
  // let userId = req.cookie.userId
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   userId = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]  // 值引用

  // 用redis 解析session
  let needSetCookie = false
  let userId = req.cookie.userId
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    set(userId, {})
  }

  req.sessionId = userId

  get(req.sessionId).then(result => {
    if (result == null) {
      set(req.sessionId, {}) // 这一步有点废话
      req.session = {}
    }
    req.session = result
    return getPostData(req)
  }).then((postData) => {
    req.body = postData
    const blogResult = blogServerHandler(req, res)
    if (blogResult) {

      // 只要有请求发过来，并且此时cookie中没有userId，就将userId写入cookie；之后同一个浏览器再发过来就认为是同一个用户了
      if (needSetCookie) {
        res.setHeader('Set-Cookie', `userId=${userId};path=/;httpOnly;expires=${setExpire()}`)
      }

      return blogResult.then((data) => {
        res.end(JSON.stringify(data))
      })

    }

    const userResult = userServerHandler(req, res)
    if (userResult) {
      if (needSetCookie) {
        res.setHeader('Set-Cookie', `userId=${userId};path=/;httpOnly;expires=${setExpire()}`)
      }
      return userResult.then(data => {
        res.end(JSON.stringify(data))
      })
    }

    res.writeHead(404)
    res.write('404 NOT FOUND\n')
    res.end()
  })
}

module.exports = serverHandler
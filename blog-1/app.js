const blogServerHandler = require('./src/router/blog')
const userServerHandler = require('./src/router/user')
const querystring = require('querystring')

const getPostData = (req) => {
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

  getPostData(req).then((postData) => {
    req.body = postData
    const blogResult = blogServerHandler(req, res)
    if (blogResult) {
      res.end(JSON.stringify(blogResult))
      return
    }

    const userResult = userServerHandler(req, res)
    if (userResult) {
      res.end(JSON.stringify(userResult))
      return
    }

    res.writeHead(404)
    res.write('404 NOT FOUND\n')
    res.end()
  })
}

module.exports = serverHandler
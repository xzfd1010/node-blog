const blogServerHandler = require('./src/blog')
const userServerHandler = require('./src/user')
const serverHandler = (req, res) => {
  const url = req.url
  req.path = url.split('?')[0]
  res.setHeader('Content-type', 'application/json')

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
}

module.exports = serverHandler
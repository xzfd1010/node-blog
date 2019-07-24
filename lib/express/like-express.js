const http = require('http')
const slice = Array.prototype.slice

class Express {
  constructor () {
    this.routes = {
      all: [], // use方式注册的函数
      get: [], // get方式注册
      post: [] // post注册的
    }
  }

  // 注册函数，传入的形式 app.use(path,middleware)的形式，path可能不存在，此时path就是function
  // 返回格式 {path, stack:[fn1,fn2]}
  register (path) {
    const info = {}
    if (typeof path === 'string') {
      info.path = path
      info.stack = slice.call(arguments, 1)
    } else {
      info.path = '/'
      info.stack = slice.call(arguments, 0)
    }
    return info
  }

  // arguments: path, callback
  use () {
    const routeInfo = this.register(...arguments)
    this.routes.all.push(routeInfo)
    console.log('app all', this.routes)
  }

  get () {
    const routeInfo = this.register(...arguments)
    this.routes.get.push(routeInfo)
  }

  post () {
    const routeInfo = this.register(...arguments)
    this.routes.post.push(routeInfo)
  }

  match (url, method) {
    let routes = []
    let result = []

    if (url === '/favicon.ico') {
      return result
    }
    // 获取当前method的所有路由
    routes = routes.concat(this.routes.all)
    routes = routes.concat(this.routes[method])
    // 根据url过滤得到需要执行的视图函数
    routes.map(routeInfo => {
      if (url.indexOf(routeInfo.path) === 0) {
        result = result.concat(routeInfo.stack)
      }
    })

    return result
  }

  // 执行视图函数
  handle (middlewareList, req, res) {
    // result是一个包含所有中间件的函数
    const next = () => {
      const current = middlewareList.shift()
      if (current) {
        current(req, res, next)
        // next传入之后，会由视图函数自己调用，形成一个调用链，调用第一个next之后，传入的第一个中间件会调用第二个....一直到最后全部调用完；
        // 如果没有next()就不会执行
      }
    }
    next()
  }

  // 用于server的回调，返回处理req/res的函数
  callback () {
    return (req, res) => {
      // 定义res.json方法，返回json格式的结果
      res.json = (data) => {
        // 如何判空
        res.end(JSON.stringify(data))
      }

      const url = req.url
      const method = req.method.toLowerCase()
      // 根据url/method匹配需要执行的函数
      const resultList = this.match(url, method)

      this.handle(resultList, req, res)
    }
  }

  // 参数形式  port, callback
  listen () {
    const server = http.createServer(this.callback())
    // 这里的callback是创建监听器之后的回调
    server.listen(...arguments)
  }
}

// 导出后执行会得到一个express
module.exports = () => {
  return new Express()
}

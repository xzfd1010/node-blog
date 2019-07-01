const http = require('http')

function compose (middlewareList) {
  return function (ctx) {
    function dispatch (i) {
      const fn = middlewareList[i]
      try {
        return Promise.resolve(
          fn(ctx, dispatch.bind(null, i + 1))
        )
      } catch (e) {
        return Promise.reject(e)
      }
    }

    dispatch(0)
  }
}

class Koa {
  constructor () {
    this.middlewareList = []
  }

  use (fn) {
    this.middlewareList.push(fn)
  }

  callback () {
    return (req, res) => {
      const ctx = { req, res }
      const fn = compose(this.middlewareList)
      fn(ctx)
    }
  }

  listen (...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

module.exports = Koa
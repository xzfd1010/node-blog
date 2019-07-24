const http = require('http')

function compose (middlewareList) {
  return function (ctx) {
    function dispatch (i) {
      const fn = middlewareList[i]
      try {
        return Promise.resolve(
          fn(ctx, dispatch.bind(null, i + 1))
          // 将 dispatch(i+1) 的函数体作为 next 传入fn
          // fn在调用 await next()时，会执行dispatch(i+1)，返回的Promise执行了fn[i+1](ctx)
          // 然后将dispatch(i+2)传给了下一个函数，依次类推
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
      const ctx = { req, res } // 组合req和res
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

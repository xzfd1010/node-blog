const Koa = require('./like-koa2')
const app = new Koa()

// logger

app.use(async (ctx, next) => {
  await next()
  // const rt = ctx.res.get('X-Response-Time')
  console.log(`${ctx.req.method} ${ctx.req.url}`)
})

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log('ms', ms)
  // ctx.res.set('X-Response-Time', `${ms}ms`)
})

// response

app.use(async ctx => {
  ctx.res.end('Hello World')
})

app.listen(8000)
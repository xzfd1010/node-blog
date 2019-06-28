const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redisClient = require('./db/redis')
const fs = require('fs')

// const index = require('./routes/index')
// const users = require('./routes/users')

const blogRouter = require('./routes/blog')
const userRouter = require('./routes/user')

const app = express()

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
const env = process.env.NODE_ENV
if (env === 'dev') {
  app.use(logger('dev'))
} else {
  const fileName = path.resolve(__dirname, 'log', 'access.log')
  const writeStream = fs.createWriteStream(fileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }))
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

// 创建存储session的redis
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'a new key',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  resave: false,
  saveUninitialized: false,
  store: sessionStore // 存储到redis中
}))

// app.use('/', index)
// app.use('/users', users)
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'dev' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

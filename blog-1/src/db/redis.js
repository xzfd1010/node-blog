const redis = require('redis')
const {REDIS_CONF} = require('../conf/db')


const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', (err) => {
  console.log(err)
})


function get (key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return
      }
      if (val == null) {
        resolve(null)
        return
      }
      try {
        resolve(JSON.parse(val))
      } catch (e) {
        resolve(val)
      }
    })
  })
}

function set (key, val) {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val)
}

module.exports = {set, get}
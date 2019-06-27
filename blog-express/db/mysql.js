const mysql = require('mysql')
const {MYSQL_CONF} = require('../conf/db')

// 创建连接
const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

function exec (sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

// 不要关闭连接，因为这个实例给所有人用
// con.end()

module.exports = {
  exec,
  escape: mysql.escape
}
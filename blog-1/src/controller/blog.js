const {exec} = require('../db/mysql')
const xss = require('xss')
const getList = (author, keyword) => {
  let sql = 'select * from blogs where 1=1'
  if (author) {
    sql += ` and author='${author}'`
  }
  if (keyword) {
    sql += ` and title like '%${keyword}%'`
  }
  sql += ' order by createtime desc;'
  return exec(sql)
}

const getDetail = (id) => {
  let sql = `select * from blogs where id=${id};`
  return exec(sql).then(rows => { // 没有考虑不存在的情况
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogData 需要提交到数据库
  // console.log('new blog', blogData)
  const title = xss(blogData.title) || ''
  const content = blogData.content || ''
  const author = blogData.author || ''
  const createtime = Date.now()

  const sql = `insert into blogs(title,content,author,createtime) values ('${title}','${content}','${author}',${createtime});`
  return exec(sql).then(insertData => {
    return {id: insertData.insertId}
  })
}

const updateBlog = (id, blogData = {}) => {
  const title = blogData.title || ''
  const content = blogData.content || ''

  const sql = `update blogs set title='${title}', content='${content}' where id=${id};`

  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true
    } else {
      return false
    }
  })
}

const delBlog = (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}';`
  return exec(sql).then(deleteData => {
    return deleteData.affectedRows > 0
  })
}

module.exports = {getList, getDetail, newBlog, updateBlog, delBlog}
const {getList, getDetail, updateBlog, newBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/index')

const blogServerHandler = (req, res) => {
  const method = req.method

  if (method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''

    const result = getList(author, keyword)
    return result.then((listData) => {
      console.log('listData', listData)
      return new SuccessModel(listData)
    })
  }
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const id = req.query.id || ''
    const result = getDetail(id)
    return result.then((data) => {
      return new SuccessModel(data)
    })
  }

  if (method === 'POST' && req.path === '/api/blog/new') {
    req.body.author = 'Nick' // 测试
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }
  if (method === 'POST' && req.path === '/api/blog/update') {
    const id = req.query.id || ''
    const result = updateBlog(id, req.body)
    if (result) {
      return new SuccessModel()
    } else {
      return new ErrorModel('更新博客失败')
    }
  }
  if (method === 'POST' && req.path === '/api/blog/del') {
    const id = req.query.id || ''
    const result = delBlog(id)
    if (result) {
      return new SuccessModel()
    } else {
      return new ErrorModel('删除博客失败')
    }
  }
}

module.exports = blogServerHandler
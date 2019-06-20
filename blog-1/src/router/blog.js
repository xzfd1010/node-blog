const {getList, getDetail, updateBlog, newBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/index')

const blogServerHandler = (req, res) => {
  const method = req.method

  if (method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''

    const result = getList(author, keyword)
    return new SuccessModel(result)
  }
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const id = req.query.id || ''
    const result = getDetail(id)
    return new SuccessModel(result)
  }
  if (method === 'POST' && req.path === '/api/blog/new') {
    const data = newBlog(req.body)
    return new SuccessModel(data)
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
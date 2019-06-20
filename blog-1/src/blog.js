const blogServerHandler = (req, res) => {
  const method = req.method
  
  if (method === 'GET' && req.path === '/api/blog/list') {
    return {
      msg: '获取博客列表数据成功'
    }
  }
  if (method === 'GET' && req.path === '/api/blog/detail') {
    return {
      msg: '获取博客详情数据成功'
    }
  }
  if (method === 'POST' && req.path === '/api/blog/new') {
    return {
      msg: '新增一篇博客数据成功'
    }
  }
  if (method === 'POST' && req.path === '/api/blog/update') {
    return {
      msg: '更新一篇博客数据成功'
    }
  }
  if (method === 'POST' && req.path === '/api/blog/del') {
    return {
      msg: '删除一篇博客数据成功'
    }
  }
}

module.exports = blogServerHandler
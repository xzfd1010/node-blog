const getList = (author, list) => {
  return [
    {
      id: 1,
      title: '标题1',
      content: '内容1',
      createTime: 1561011799516,
      author: 'Nick'
    },
    {
      id: 2,
      title: '标题2',
      content: '内容2',
      createTime: 1561011838602,
      author: 'Bob'
    }
  ]
}

const getDetail = (id) => {
  return {
    id: 1,
    title: '标题1',
    content: '内容1',
    createTime: 1561011799516,
    author: 'Nick'
  }
}

const newBlog = (blogData = {}) => {
  // blogData 需要提交到数据库
  // console.log('new blog', blogData)

  return {
    id: 3
  }
}

const updateBlog = (id, blogData = {}) => {
  // console.log('update blog', id, blogData)

  return true
}

const delBlog = (id) => {
  return true
}

module.exports = {getList, getDetail, newBlog, updateBlog, delBlog}
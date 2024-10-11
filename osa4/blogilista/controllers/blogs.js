const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/',async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body 
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog ({ 
      title: body.title, 
      author: body.author, 
      url: body.url, 
      likes: body.likes,
      user: user._id

    })
    blog.likes= blog.likes || 0
    if (!blog.title || !blog.url) {
      return response.status(400).json({error: 'Title or URL is missing'})
    }
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    response.status(201).json(savedBlog)
    await user.save()   
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if ( blog.user.toString() !== user.id.toString() ) {
    return response.status(401).json({ error: 'user not authorized' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async(request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog) 
})
module.exports = blogsRouter
const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  console.log('NODE_ENV:', process.env.NODE_ENV)
  response.status(204).end()
})

module.exports = router
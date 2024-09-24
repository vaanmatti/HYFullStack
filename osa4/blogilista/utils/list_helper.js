const { group } = require('console')
const _ = require('lodash')
const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
   if (blogs.length === 0) {
    return 0
   } else if (blogs.length === 1) {
    return blogs[0].likes
   } else {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
   }
}
const favoriteBlog = (blogs) => {
    const bestBlog = blogs.reduce((maxBlog, currentBlog) => {
        return currentBlog.likes > maxBlog.likes ? currentBlog : maxBlog
    }, blogs[0])
    const result = {author: bestBlog.author, likes: bestBlog.likes, title: bestBlog.title}
    return result
}

const mostBlogs = (blogs) => {
    const mostBlogsAuthor = _.chain(blogs)
        .countBy('author')            
        .toPairs()                   
        .maxBy(_.last)                
        .thru(pair => ({              
            author: pair[0], 
            blogs: pair[1] 
        }))
        .value(); 
    return mostBlogsAuthor
}

const mostLikes = (blogs) => {
    const mostLikesAuthor = _.chain(blogs)
        .groupBy('author')
        .map((authorBlogs, author) => ({
            author: author,
            likes: _.sumBy(authorBlogs, 'likes')
        }))
        .maxBy('likes')
        .value()
    return mostLikesAuthor
}
module.exports = {
   dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }
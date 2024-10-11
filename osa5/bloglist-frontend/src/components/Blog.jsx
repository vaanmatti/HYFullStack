import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLikeUpdate, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    try {
      const updatedLikes = likes +1
      const updatedBlog = {
        ...blog,
        likes: updatedLikes
      }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setLikes(updatedLikes)
      onLikeUpdate(returnedBlog)
    } catch (error) {
      console.error(error)
    }
  }
  const deleteBlog = async () => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.deleteBlog(blog.id)
        onDelete(blog.id)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const isCreator = blog.user.username === currentUser.username
  return (
    <div style={blogStyle}>
      <div className="blog-title-author">
        {blog.title} {blog.author}
      </div>
      <button onClick={toggleVisibility}>
        {visible ? 'hide': 'view'}
      </button>

      {visible &&(
        <div className='blog-details'>
          <span className='blog-url'>{blog.url}</span>
          <br />
          <span className='blog-likes'> likes {likes}</span>
          <button onClick ={handleLike}>like</button>
          <br />
          <span className='blog-user'>{blog.user.name}</span>
          {isCreator && (
            <button onClick = {deleteBlog}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLikeUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired
}
export default Blog
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls addBlog with the correct details when a new blog is created', async () => {
  const addBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm addBlog={addBlog} />)

  const title = screen.getByTestId('title')
  const author = screen.getByTestId('author')
  const url = screen.getByTestId('url')
  const createButton = screen.getByText('create')

  await user.type(title, 'Test Title')
  await user.type(author, 'Test Author')
  await user.type(url, 'blog.com')

  await user.click(createButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  const blog = addBlog.mock.calls[0][0]
  expect(blog.title).toBe('Test Title')
  expect(blog.author).toBe('Test Author')
  expect(blog.url).toBe('blog.com')
})
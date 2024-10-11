import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

vi.mock('../services/blogs')
const blog = {
  title: 'Test Title',
  author: 'Test author',
  url: 'test.com',
  likes: 0,
  user: {
    username: 'user',
    name: 'name',
  },
}

const currentUser = {
  username: 'user',
  name: 'name',
}

const onLikeUpdate = vi.fn()
const onDelete = vi.fn()
test('renders content', () => {

  const { container } = render(<Blog
    blog={blog}
    onLikeUpdate={onLikeUpdate}
    onDelete={onDelete}
    currentUser={currentUser}
  />)
  const element = container.querySelector('.blog-title-author')
  expect(element).toHaveTextContent('Test Title')
  expect(screen.queryByText('test.com')).toBeNull()
  expect(screen.queryByText('likes 0')).toBeNull()
})

test('shows URL and likes when the view button is clicked', async () => {
  render(<Blog
    blog={blog}
    onLikeUpdate={onLikeUpdate}
    onDelete={onDelete}
    currentUser={currentUser}
  />)
  const user = userEvent.setup()
  const button = screen.getByText('view')

  await user.click(button)

  expect(screen.getByText('test.com')).toBeDefined()
  expect(screen.getByText('likes 0')).toBeDefined()
})

test('calls event handler twice when like button is clicked twice', async () => {

  render(<Blog
    blog={blog}
    onLikeUpdate={onLikeUpdate}
    onDelete={onDelete}
    currentUser={currentUser}
  />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)


  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(onLikeUpdate.mock.calls).toHaveLength(2)
})
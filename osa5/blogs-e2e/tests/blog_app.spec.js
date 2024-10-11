const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Va',
        username: 'mavi',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mavi', 'salainen')
      await page.getByRole('button', {name: 'login'}).click()

      await expect(page.getByText('Matti Va logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mavi', 'wrong')
      await page.getByRole('button', {name: 'login'}).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Va logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mavi', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await expect(page.locator('.blog-title-author').getByText('test title')).toBeVisible()
    })
    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')

      const blogElement = await page.getByText('test title').locator('..')
      await blogElement
        .getByRole('button', { name: 'view' }).click()
      await blogElement
        .getByRole('button', { name: 'like' }).click()
      await expect(blogElement.getByText('likes 1')).toBeVisible()
    })
    test('user can delete a blog', async ({ page}) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await page.waitForTimeout(3000) // wait for successful notification dissapear
      const blogElement = await page.getByText('test title').locator('..')
      await blogElement.getByRole('button', { name: 'view' }).click()
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })
      await blogElement.getByRole('button', { name: 'remove' }).click()
      await expect(blogElement).not.toBeVisible()
    })
  })
})

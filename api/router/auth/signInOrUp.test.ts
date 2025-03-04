import { it, expect, vi } from 'vitest'

import expectExpressHandler from '@api/testUtilities/expectExpressHandler'
import { mockExpressArguments } from '@api/testUtilities/mockExpress'
import User from '@api/models/user'
import { signToken } from '@api/utilities/userToken'

import handleSignInOrUp from './signInOrUp'

vi.mock('@api/models/user')
vi.mock('@api/utilities/userToken')

const _id = 'a1b2c3d4e5f6a7b8c9d0e1f2'
const email = 'test@example.com'
const password = 'password123'

const mockedUser = vi.mocked(User)
const mockedSignToken = vi.mocked(signToken)

expectExpressHandler(handleSignInOrUp, (req) => {
  req.body = { email, password }
  mockedUser.findOne.mockResolvedValueOnce(null)
  mockedUser.prototype.save.mockResolvedValueOnce({
    _id,
    email,
    password,
  })
  mockedSignToken.mockReturnValueOnce('fakeAccessToken')
})

it('should return 401 if email is already used and password is incorrect', async () => {
  const [req, res, next] = mockExpressArguments({ body: { email, password } })

  mockedUser.findOne.mockResolvedValueOnce({
    comparePassword: vi.fn().mockResolvedValueOnce(false),
  })

  await handleSignInOrUp(req, res, next)

  expect(res.status).toHaveBeenCalledWith(401)
})

it('should return access token if email is already used and password is correct', async () => {
  const [req, res, next] = mockExpressArguments({ body: { email, password } })

  mockedUser.findOne.mockResolvedValueOnce({
    _id,
    email,
    password,
    comparePassword: vi.fn().mockResolvedValueOnce(true),
  })
  mockedSignToken.mockReturnValueOnce('fakeAccessToken')

  await handleSignInOrUp(req, res, next)

  expect(mockedUser.findOne).toHaveBeenCalledWith({ email })
  expect(mockedSignToken).toHaveBeenCalledWith({ userId: _id, email })
  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.send).toHaveBeenCalledWith('fakeAccessToken')
})

it('should create a new user and return access token', async () => {
  const [req, res, next] = mockExpressArguments({ body: { email, password } })

  mockedUser.findOne.mockResolvedValueOnce(null)
  mockedUser.prototype.save.mockResolvedValueOnce({
    _id,
    email,
    password,
  })
  mockedSignToken.mockReturnValueOnce('fakeAccessToken')

  await handleSignInOrUp(req, res, next)

  expect(mockedUser.findOne).toHaveBeenCalledWith({ email })
  expect(mockedUser).toHaveBeenCalledWith({ email, password })
  expect(mockedUser.prototype.save).toHaveBeenCalled()
  expect(mockedSignToken).toHaveBeenCalledWith({ userId: _id, email })
  expect(res.status).toHaveBeenCalledWith(201)
  expect(res.send).toHaveBeenCalledWith('fakeAccessToken')
})

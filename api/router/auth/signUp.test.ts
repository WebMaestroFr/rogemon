import { it, expect, vi } from 'vitest'

import expectExpressHandler from '@api/testUtilities/expectExpressHandler'
import { mockExpressArguments } from '@api/testUtilities/mockExpress'
import User from '@api/models/user'
import { signToken } from '@api/utilities/userToken'

import handleSignUp from './signUp'

vi.mock('@api/models/user')
vi.mock('@api/utilities/userToken')

const _id = 'a1b2c3d4e5f6a7b8c9d0e1f2'
const email = 'test@example.com'
const password = 'password123'

const mockedUser = vi.mocked(User)
const mockedSignToken = vi.mocked(signToken)

expectExpressHandler(handleSignUp, (req) => {
  req.body = { email, password }
  mockedUser.findOne.mockResolvedValueOnce(null)
  mockedUser.prototype.save.mockResolvedValueOnce({
    _id,
    email,
    password,
  })
  mockedSignToken.mockReturnValueOnce('fakeAccessToken')
})

it('should return 409 if email is already used', async () => {
  const [req, res, next] = mockExpressArguments({ body: { email, password } })

  mockedUser.findOne.mockResolvedValueOnce({ _id })

  await handleSignUp(req, res, next)

  expect(User.findOne).toHaveBeenCalledWith({ email })
  expect(res.status).toHaveBeenCalledWith(409)
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

  await handleSignUp(req, res, next)

  expect(User.findOne).toHaveBeenCalledWith({ email })
  expect(User).toHaveBeenCalledWith({ email, password })
  expect(User.prototype.save).toHaveBeenCalled()
  expect(signToken).toHaveBeenCalledWith({ userId: _id, email })
  expect(res.status).toHaveBeenCalledWith(201)
  expect(res.send).toHaveBeenCalledWith('fakeAccessToken')
})

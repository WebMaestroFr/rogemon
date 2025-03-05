import { type NextFunction, type Request, type Response } from 'express'

import User from '@api/models/user'
import { sendError, sendText } from '@api/utilities/sendResponse'
import assertRequestBody from '@api/utilities/assertRequestBody'
import { signToken } from '@api/utilities/userToken'

export default async function handleSignUp(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    assertRequestBody<{ email: string; password: string }>(req.body, res, {
      email: { label: 'Email', required: true, email: true },
      password: { label: 'Password', required: true, minLength: 6 },
    })
    const { email, password } = req.body
    const verifyEmail = await User.findOne({ email })
    if (verifyEmail) {
      return sendError(res, 409, 'Email already used')
    }
    const user = new User({ email, password })
    const userResult = await user.save()
    const accessToken = signToken({ userId: userResult._id.toString(), email })
    return sendText(res, 201, accessToken)
  } catch (err) {
    next(err)
  }
}

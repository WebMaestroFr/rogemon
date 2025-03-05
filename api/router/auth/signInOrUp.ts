import { type NextFunction, type Request, type Response } from 'express'

import User from '@api/models/user'
import { sendError, sendText } from '@api/utilities/sendResponse'
import assertRequestBody from '@api/utilities/assertRequestBody'
import { signToken } from '@api/utilities/userToken'

// Temporary mixed register and login
// Because I'm too lazy to verify emails just yet

export default async function handleSignInOrUp(
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
    const emailUser = await User.findOne({ email })
    if (emailUser) {
      // SignIn
      const isPasswordCorrect = await emailUser.comparePassword(password)
      if (!isPasswordCorrect) {
        return sendError(res, 401, 'Invalid email or password')
      }
      const accessToken = signToken({
        userId: emailUser._id.toString(),
        email,
      })
      return sendText(res, 200, accessToken)
    }
    // SignUp
    const user = new User({ email, password })
    const userResult = await user.save()
    const accessToken = signToken({ userId: userResult._id.toString(), email })
    return sendText(res, 201, accessToken)
  } catch (err) {
    next(err)
  }
}

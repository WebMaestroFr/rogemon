import { type Request, type Response, type NextFunction } from 'express'
import { vi, type Mock } from 'vitest'

export const mockRequest = (req: Partial<Request> = {}) => ({ ...req }) as Request

export function mockResponse(res: Partial<Response> = {}) {
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  return res as Response
}

export const mockNext = () => vi.fn() as NextFunction

export function mockExpressArguments(req: Partial<Request> = {}, res: Partial<Response> = {}) {
  return [mockRequest(req), mockResponse(res), mockNext()] as [
    req: Request,
    res: Response & {
      status: Mock
      json: Mock
      send: Mock
    },
    next: NextFunction,
  ]
}

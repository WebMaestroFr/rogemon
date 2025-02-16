import { Request, Response, NextFunction } from "express";
import { vi } from "vitest";

export const mockRequest = (req: Partial<Request> = {}) =>
  ({ ...req, body: { ...req.body } } as Request);

export function mockResponse(res: Partial<Response> = {}) {
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res as Response;
}

export const mockNext = () => vi.fn() as NextFunction;

export default function mockExpress(
  req: Partial<Request> = {},
  res: Partial<Response> = {}
) {
  return [mockRequest(req), mockResponse(res), mockNext()] as [
    req: Request,
    res: Response,
    next: NextFunction
  ];
}

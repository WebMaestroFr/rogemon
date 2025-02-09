import { Request, Response, NextFunction } from "express";
import { vi } from "vitest";

export const mockRequest = (req: Partial<Request> = {}) => req as Request;

export function mockResponse(res: Partial<Response> = {}) {
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.locals = res.locals || {};
  return res as Response;
}

export const mockNext = () => vi.fn() as NextFunction;

export default (req: Partial<Request> = {}, res: Partial<Response> = {}) =>
  [mockRequest(req), mockResponse(res), mockNext()] as [
    req: Request,
    res: Response,
    next: NextFunction
  ];

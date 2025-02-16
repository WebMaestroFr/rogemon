import { Request, Response, NextFunction } from "express";
import { it, expect, Mock, vi } from "vitest";

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

export function expectValidHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
  beforeRequest: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void = () => {}
) {
  it("should call next function with error if an exception occurs", async () => {
    const [req, res, next] = mockExpress();
    beforeRequest(req, res, next);

    const error = new Error("Response status test error");
    (res.status as Mock).mockImplementationOnce(() => {
      throw error;
    });
    await handler(req, res, next);

    expect(next).toHaveBeenCalledExactlyOnceWith(error);
  });

  it("should not throw an unexpected exception", async () => {
    const [req, res, next] = mockExpress();
    beforeRequest(req, res, next);

    await handler(req, res, next);

    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return void", async () => {
    const [req, res, next] = mockExpress();
    beforeRequest(req, res, next);

    const result = await handler(req, res, next);

    expect(result).toBeUndefined();
  });

  it("should set status and send response", async () => {
    const [req, res, next] = mockExpress();
    beforeRequest(req, res, next);

    await handler(req, res, next);

    expect(res.status).toHaveBeenCalledOnce();
    const resJsonHasBeenCalledOnce = (res.json as Mock).mock.calls.length === 1;
    const resSendHasBeenCalledOnce = (res.send as Mock).mock.calls.length === 1;
    expect(resJsonHasBeenCalledOnce || resSendHasBeenCalledOnce).toBe(true);
  });
}

import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error & { status?: number; code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status ?? 500;
  const code = err.code ?? 'INTERNAL_ERROR';
  const message = status === 500 ? 'Internal server error' : err.message;
  const requestId = _req.requestId;

  res.status(status).json({
    code,
    message,
    ...(requestId && { requestId }),
  });
}

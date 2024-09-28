import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';

const csrfProtection = csrf({
  cookie: {
    key: 'XSRF-TOKEN',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    return next();
  }
  csrfProtection(req, res, next);
};
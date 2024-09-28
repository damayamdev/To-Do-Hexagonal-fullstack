import { Request, Response, NextFunction } from 'express';
import { AuthUseCase } from '../../../application/use-cases/auth.use-case';

export const authMiddleware = (authUseCase: AuthUseCase) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const user = await authUseCase.validateToken(token);
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
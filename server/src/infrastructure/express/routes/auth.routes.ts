import { Router, Request, Response } from 'express';
import { AuthUseCase } from '../../../application/use-cases/auth.use-case';
import { authMiddleware } from '../middlewares/auth.middleware';

interface UserResponse {
  id: string;
  email: string;
}

export const authRouter = (authUseCase: AuthUseCase) => {

  const router = Router();

  router.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authUseCase.registerUser(email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const tokens = await authUseCase.loginUser(email, password);
      res.json(tokens);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });

  router.post('/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const newAccessToken = await authUseCase.refreshToken(refreshToken);
      res.json(newAccessToken);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });


  return router;
};
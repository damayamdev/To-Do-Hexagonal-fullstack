import { User } from '../../domain/entities/user.entity';

export interface AuthPort {
  registerUser(email: string, password: string): Promise<User>;
  loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
  validateToken(token: string): Promise<User>;
}
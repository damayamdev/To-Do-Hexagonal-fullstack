import { User } from '../../domain/entities/user.entity';

export interface AuthPort {
  login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
  register(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
  getCurrentUser(): Promise<User | null>;
}
import { AuthPort } from '../ports/auth.port';
import { User } from '../../domain/entities/user.entity';

export class AuthUseCase {
  constructor(private authPort: AuthPort) {}

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authPort.login(email, password);
  }

  async register(email: string, password: string): Promise<User> {
    return this.authPort.register(email, password);
  }

  async logout(): Promise<void> {
    return this.authPort.logout();
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return this.authPort.refreshToken(refreshToken);
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authPort.getCurrentUser();
  }
}
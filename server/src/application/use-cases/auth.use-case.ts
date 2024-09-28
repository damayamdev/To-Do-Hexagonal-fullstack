import { AuthPort } from '../ports/auth.port';
import { User } from '../../domain/entities/user.entity';

export class AuthUseCase {
  constructor(private authPort: AuthPort) {}

  async registerUser(email: string, password: string): Promise<User> {
    return this.authPort.registerUser(email, password);
  }

  async loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authPort.loginUser(email, password);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return this.authPort.refreshToken(refreshToken);
  }

  async validateToken(token: string): Promise<User> {
    return this.authPort.validateToken(token);
  }
}
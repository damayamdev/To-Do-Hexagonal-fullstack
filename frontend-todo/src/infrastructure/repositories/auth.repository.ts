import { AuthPort } from '../../application/ports/auth.port';
import { User } from '../../domain/entities/user.entity';
import { api } from '../adapters/api.adapter';

export class AuthRepository implements AuthPort {
  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }

  async register(email: string, password: string): Promise<User> {
    const { data } = await api.post('/auth/register', { email, password });
    return data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Optionally, you can also call a logout endpoint on your server
    // await api.post('/auth/logout');
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    localStorage.setItem('accessToken', data.accessToken);
    return data;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await api.get('/todos/me');
      return data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../../domain/entities/user.entity';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const authRepository = new AuthRepository();
  const authUseCase = new AuthUseCase(authRepository);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const currentUser = await authUseCase.getCurrentUser();
        setUser(currentUser);
        return true;
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return false;
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
    return false;
  }, [authUseCase]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await authUseCase.login(email, password);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      const currentUser = await authUseCase.getCurrentUser();
      setUser(currentUser);
      navigate('/todos');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authUseCase.register(email, password);
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authUseCase.logout();
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, checkAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
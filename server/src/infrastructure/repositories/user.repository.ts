import { AuthPort } from '../../application/ports/auth.port';
import { JWTAdapter } from '../adapters/jwt.adapter';
import { User, UserModel } from '../../domain/entities/user.entity';
import bcrypt from 'bcrypt';

export class UserRepository implements AuthPort {
  constructor(private jwtAdapter: JWTAdapter) {}

  async registerUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      email,
      password: hashedPassword,
    });
    await user.save();
    return user;
  }

  async loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const accessToken = this.jwtAdapter.sign({ userId: user._id }, '15m');
    const refreshToken = this.jwtAdapter.sign({ userId: user._id }, '7d');
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = this.jwtAdapter.verify(refreshToken);
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      throw new Error('Invalid refresh token');
    }
    const accessToken = this.jwtAdapter.sign({ userId: user._id }, '15m');
    return { accessToken };
  }

  async validateToken(token: string): Promise<User> {
    const payload = this.jwtAdapter.verify(token);
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
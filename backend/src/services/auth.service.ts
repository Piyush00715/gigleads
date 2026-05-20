import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRepository } from '../repositories/user.repository';
import { IUserDocument } from '../interfaces/user.interface';
import { ConflictError, UnauthorizedError } from '../utils/errors';

export class AuthService {
  private userRepository = new UserRepository();

  private generateToken(user: IUserDocument): string {
    return jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  async register(userData: Partial<IUserDocument>): Promise<{ user: IUserDocument; token: string }> {
    const existing = await this.userRepository.findByEmail(userData.email!);
    if (existing) {
      throw new ConflictError('Email is already registered');
    }

    const user = await this.userRepository.create(userData);
    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: IUserDocument; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user);
    return { user, token };
  }
}

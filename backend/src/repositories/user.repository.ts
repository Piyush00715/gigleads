import { User } from '../models/user.model';
import { IUserDocument } from '../interfaces/user.interface';

export class UserRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email }).select('+password');
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async create(userData: Partial<IUserDocument>): Promise<IUserDocument> {
    const user = new User(userData);
    return user.save();
  }
}

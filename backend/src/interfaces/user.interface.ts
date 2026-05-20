import { Document } from 'mongoose';

export type UserRole = 'Admin' | 'Sales';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

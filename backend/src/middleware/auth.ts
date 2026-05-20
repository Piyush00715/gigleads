import { Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRepository } from '../repositories/user.repository';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { IUserDocument } from '../interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

const userRepository = new UserRepository();

interface TokenPayload {
  id: string;
  role: string;
}

export const protect = async (req: Request, _res: any, next: NextFunction): Promise<void> => {
  try {
    let token = '';

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new UnauthorizedError('Please authenticate to access this resource.'));
    }

    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch (err) {
      return next(new UnauthorizedError('Token is invalid or expired.'));
    }

    const currentUser = await userRepository.findById(decoded.id);
    if (!currentUser) {
      return next(new UnauthorizedError('User session no longer exists.'));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles: Array<'Admin' | 'Sales'>) => {
  return (req: Request, _res: any, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permissions for this action.'));
    }
    next();
  };
};

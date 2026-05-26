import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { AppError } from '../utils/errors';
import bcrypt from 'bcryptjs';

export class UserController {
  // PUT /users/me — update name, email, password
  updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, currentPassword, newPassword } = req.body;
      const userId = req.user?._id;

      // Find user with password field
      const user = await User.findById(userId).select('+password');
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      // If changing password, verify current password first
      if (newPassword) {
        if (!currentPassword) {
          return next(new AppError('Current password is required to set a new password', 400));
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password as string);
        if (!isMatch) {
          return next(new AppError('Current password is incorrect', 401));
        }
        user.password = newPassword; // pre-save hook will hash it
      }

      // Update name and email
      if (name) user.name = name;
      if (email) user.email = email;

      await user.save();

      // Return user without password
      const updatedUser = await User.findById(userId);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  };
}

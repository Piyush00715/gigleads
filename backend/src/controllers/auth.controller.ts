import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { env } from '../config/env';

export class AuthController {
  private authService = new AuthService();

  private sendTokenResponse = (user: any, token: string, statusCode: number, res: Response) => {
    const isProduction = env.NODE_ENV === 'production';
    
    // Cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
    };

    res
      .status(statusCode)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: statusCode === 201 ? 'User registered successfully' : 'User logged in successfully',
        data: {
          user,
          token,
        },
      });
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;
      const { user, token } = await this.authService.register({ name, email, password, role });
      
      this.sendTokenResponse(user, token, 201, res);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);

      this.sendTokenResponse(user, token, 200, res);
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // 10 seconds
        httpOnly: true,
      });

      res.status(200).json({
        success: true,
        message: 'User logged out successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        message: 'Current user session retrieved successfully',
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

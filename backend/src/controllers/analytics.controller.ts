import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  private analyticsService = new AnalyticsService();

  getSummary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.analyticsService.getDashboardSummary();

      res.status(200).json({
        success: true,
        message: 'Analytics summary retrieved successfully',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  };
}

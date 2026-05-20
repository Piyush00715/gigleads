import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';

export class LeadController {
  private leadService = new LeadService();

  createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const leadData = {
        ...req.body,
        // Default assignment to the logged-in rep if not specified, but let's allow general pool too
        assignedTo: req.body.assignedTo || req.user?._id,
      };

      const lead = await this.leadService.createLead(leadData);

      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: { lead },
      });
    } catch (error) {
      next(error);
    }
  };

  getLeadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const lead = await this.leadService.getLeadById(id);

      res.status(200).json({
        success: true,
        message: 'Lead retrieved successfully',
        data: { lead },
      });
    } catch (error) {
      next(error);
    }
  };

  updateLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const lead = await this.leadService.updateLead(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        data: { lead },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.leadService.deleteLead(id);

      res.status(200).json({
        success: true,
        message: 'Lead deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, status, source, search, sortBy, sortOrder } = req.query as any;

      const filters = { status, source, search };
      const options = { page, limit, sortBy, sortOrder };

      const result = await this.leadService.getPaginatedLeads(filters, options);

      res.status(200).json({
        success: true,
        message: 'Leads list retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  exportCSV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, source, search } = req.query as any;
      const filters = { status, source, search };

      const csvData = await this.leadService.exportLeadsToCSV(filters);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=leads-export-${Date.now()}.csv`);
      res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  };
}

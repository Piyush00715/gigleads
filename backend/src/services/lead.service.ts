import { LeadRepository } from '../repositories/lead.repository';
import { ILeadDocument } from '../interfaces/lead.interface';
import { NotFoundError } from '../utils/errors';
import { CSVService } from './csv.service';

export class LeadService {
  private leadRepository = new LeadRepository();
  private csvService = new CSVService();

  async createLead(leadData: Partial<ILeadDocument>): Promise<ILeadDocument> {
    return this.leadRepository.create(leadData);
  }

  async getLeadById(id: string): Promise<ILeadDocument> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }
    return lead;
  }

  async updateLead(id: string, leadData: Partial<ILeadDocument>): Promise<ILeadDocument> {
    const lead = await this.leadRepository.update(id, leadData);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }
    return lead;
  }

  async deleteLead(id: string): Promise<void> {
    const lead = await this.leadRepository.delete(id);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }
  }

  async getPaginatedLeads(
    filters: { status?: string; source?: string; search?: string },
    options: { page: number; limit: number; sortBy?: 'createdAt'; sortOrder?: 'asc' | 'desc' }
  ) {
    const { leads, total } = await this.leadRepository.findPaginated(filters, options);
    const totalPages = Math.ceil(total / options.limit);

    return {
      leads,
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages,
        hasNextPage: options.page < totalPages,
        hasPrevPage: options.page > 1,
      },
    };
  }

  async exportLeadsToCSV(filters: { status?: string; source?: string; search?: string }): Promise<string> {
    const leads = await this.leadRepository.findAllFiltered(filters);
    return this.csvService.generateLeadsCSV(leads);
  }
}

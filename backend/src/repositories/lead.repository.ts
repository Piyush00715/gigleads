import { Lead } from '../models/lead.model';
import { ILeadDocument } from '../interfaces/lead.interface';

interface FindLeadsFilters {
  status?: string;
  source?: string;
  search?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export class LeadRepository {
  async findById(id: string): Promise<ILeadDocument | null> {
    return Lead.findById(id).populate('assignedTo', 'name email role');
  }

  async create(leadData: Partial<ILeadDocument>): Promise<ILeadDocument> {
    const lead = new Lead(leadData);
    const saved = await lead.save();
    return saved.populate('assignedTo', 'name email role');
  }

  async update(id: string, leadData: Partial<ILeadDocument>): Promise<ILeadDocument | null> {
    const updated = await Lead.findByIdAndUpdate(id, leadData, { new: true, runValidators: true });
    if (!updated) return null;
    return updated.populate('assignedTo', 'name email role');
  }

  async delete(id: string): Promise<ILeadDocument | null> {
    return Lead.findByIdAndDelete(id);
  }

  buildQuery(filters: FindLeadsFilters) {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.source) {
      query.source = filters.source;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }

    return query;
  }

  async findPaginated(
    filters: FindLeadsFilters,
    options: PaginationOptions
  ): Promise<{ leads: ILeadDocument[]; total: number }> {
    const query = this.buildQuery(filters);
    const skip = (options.page - 1) * options.limit;
    
    const sortField = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj = { [sortField]: sortOrder as 1 | -1 };

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(options.limit)
        .populate('assignedTo', 'name email role'),
      Lead.countDocuments(query)
    ]);

    return { leads, total };
  }

  async findAllFiltered(filters: FindLeadsFilters, sortBy: 'createdAt' = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc'): Promise<ILeadDocument[]> {
    const query = this.buildQuery(filters);
    const sortVal = sortOrder === 'asc' ? 1 : -1;
    return Lead.find(query).sort({ [sortBy]: sortVal as 1 | -1 }).populate('assignedTo', 'name email role');
  }

  async countByStatus(): Promise<Array<{ _id: string; count: number }>> {
    return Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async countBySource(): Promise<Array<{ _id: string; count: number }>> {
    return Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async countTotal(): Promise<number> {
    return Lead.countDocuments();
  }

  async getMonthlyTrend(monthsLimit: number = 6): Promise<Array<{ _id: string; count: number }>> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsLimit);

    return Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          count: 1,
        },
      },
    ]);
  }

  async getRecentLeads(limit: number = 5): Promise<ILeadDocument[]> {
    return Lead.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('assignedTo', 'name email role');
  }
}

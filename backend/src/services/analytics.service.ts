import { LeadRepository } from '../repositories/lead.repository';

export class AnalyticsService {
  private leadRepository = new LeadRepository();

  async getDashboardSummary() {
    const [totalLeads, statusGroups, sourceGroups, recentLeads, monthlyTrend] = await Promise.all([
      this.leadRepository.countTotal(),
      this.leadRepository.countByStatus(),
      this.leadRepository.countBySource(),
      this.leadRepository.getRecentLeads(5),
      this.leadRepository.getMonthlyTrend(6),
    ]);

    // Construct breakdown objects ensuring defaults
    const statusBreakdown: Record<string, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Lost: 0,
    };
    statusGroups.forEach((item) => {
      if (item._id) statusBreakdown[item._id] = item.count;
    });

    const sourceBreakdown: Record<string, number> = {
      Website: 0,
      Instagram: 0,
      Referral: 0,
    };
    sourceGroups.forEach((item) => {
      if (item._id) sourceBreakdown[item._id] = item.count;
    });

    return {
      totalLeads,
      statusBreakdown,
      sourceBreakdown,
      recentLeads,
      monthlyTrend,
    };
  }
}

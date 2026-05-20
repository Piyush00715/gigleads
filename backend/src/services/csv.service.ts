import { ILeadDocument } from '../interfaces/lead.interface';

export class CSVService {
  generateLeadsCSV(leads: ILeadDocument[]): string {
    const headers = ['Lead ID', 'Name', 'Email', 'Status', 'Source', 'Assigned Rep', 'Created Date'];

    const rows = leads.map((lead) => {
      let repName = 'Unassigned';
      if (lead.assignedTo && typeof lead.assignedTo === 'object') {
        repName = (lead.assignedTo as any).name || 'Unassigned';
      }

      return [
        lead._id.toString(),
        this.escapeCSVField(lead.name),
        this.escapeCSVField(lead.email),
        lead.status,
        lead.source,
        this.escapeCSVField(repName),
        lead.createdAt ? lead.createdAt.toISOString() : '',
      ];
    });

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  }

  private escapeCSVField(val: string): string {
    if (!val) return '';
    const formatted = val.replace(/"/g, '""');
    if (formatted.includes(',') || formatted.includes('"') || formatted.includes('\n') || formatted.includes('\r')) {
      return `"${formatted}"`;
    }
    return formatted;
  }
}

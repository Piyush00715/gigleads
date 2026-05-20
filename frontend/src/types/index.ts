export type UserRole = 'Admin' | 'Sales';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: PaginationMetadata;
}

export interface AnalyticsSummary {
  totalLeads: number;
  statusBreakdown: Record<LeadStatus, number>;
  sourceBreakdown: Record<LeadSource, number>;
  recentLeads: Lead[];
  monthlyTrend: Array<{ date: string; count: number }>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

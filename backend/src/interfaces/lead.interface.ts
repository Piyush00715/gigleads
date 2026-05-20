import { Document, Schema } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: Schema.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead, Document {}

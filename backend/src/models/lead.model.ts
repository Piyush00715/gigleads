import { Schema, model } from 'mongoose';
import { ILeadDocument } from '../interfaces/lead.interface';

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
      index: true,
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: [true, 'Lead source is required'],
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for text searches (optional, but standard regex handles partial matches nicely too)
leadSchema.index({ name: 'text', email: 'text' });

// Add helper to convert to JSON cleanly
leadSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const r = ret as any;
    delete r.__v;
    return r;
  },
});

export const Lead = model<ILeadDocument>('Lead', leadSchema);

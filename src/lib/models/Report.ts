import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  ngoId: { type: String, required: true },
  month: { type: String, required: true }, // Format: YYYY-MM
  peopleHelped: { type: Number, required: true, default: 0 },
  eventsConducted: { type: Number, required: true, default: 0 },
  fundsUtilized: { type: Number, required: true, default: 0 },
  region: { type: String, enum: ['North', 'South', 'East', 'West', 'All'], default: 'South' },
  jobId: { type: String, default: null }, // Link to bulk upload job if applicable
  createdAt: { type: Date, default: Date.now },
});

// Compound index for idempotency: One report per NGO per Month
ReportSchema.index({ ngoId: 1, month: 1 }, { unique: true });

const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);

export default Report;


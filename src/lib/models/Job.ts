import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // UUID
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  totalRows: { type: Number, default: 0 },
  processedRows: { type: Number, default: 0 },
  failedRows: { type: Number, default: 0 },
  errors: [{
    row: Number,
    message: String,
    data: Object
  }], // Store row-level errors
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  suppressReservedKeysWarning: true // Suppress warning about 'errors' field
});

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default Job;


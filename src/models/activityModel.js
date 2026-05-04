import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  type: {
    type: String,
    enum: ['application', 'job', 'user', 'alert'],
    required: true,
  },
  action: {
    type: String,
    required: true, // e.g., 'applied for', 'posted a new job', 'moved to Interview'
  },
  target: {
    type: String, // e.g., Job Title or Candidate Name
    required: true,
  },
  metadata: {
    applicationId: mongoose.Schema.Types.ObjectId,
    jobId: mongoose.Schema.Types.ObjectId,
    candidateId: mongoose.Schema.Types.ObjectId,
  }
}, {
  timestamps: true,
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;

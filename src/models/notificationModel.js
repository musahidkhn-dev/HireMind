import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: [
                'application_received',    // Company Gets this
                'application_status',     // Candidate gets this
                'interview_scheduled',
                'Offer_extended',
                'application_rejected',
                'recruiter_invited',
                'job_published',
                'new_message',
            ],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        data: {
            // Extra Content Data
            jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
            applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', default: null },
            companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', default: null },
        },
    },
    { timestamps: true }
);

// Auto delete notifications older than 30 days
notificationSchema.index({ createdAt: 1}, { expiredAfterSecond: 30 * 24 * 60 * 60 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
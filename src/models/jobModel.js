import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        requirements: [
            {
                type: String,
            },
        ],
        skills: [
            {
                type: String,
            },
        ],
        location: {
            type: String,
            default: '',
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
            default: 'full-time',
        },
        salaryRange: {
            min: { type: Number, default: 0},
            max: { type: Number, default: 0},
            currency: { type: String, default: 'USD'}
        },
        status: {
            type : String,
            enum: ['draft', 'active', 'closed'],
            default: 'draft'
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true, // recruiter
            index: true
        },
        pipelineStages: {
            type: [String],
            default: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
        },
        aiInterviewQuestions: [
            {
                question: String,
                type: {
                    type: String,
                    enum: ['behavioral', 'technical', 'situational'],
                },
            },
        ],
        applicationCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true
    }
)

jobSchema.index({ createdBy: 1, _id: 1 });

const Job =  mongoose.model('Job', jobSchema)
export default Job
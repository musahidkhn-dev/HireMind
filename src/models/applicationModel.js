import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        resumeUrl: {
            type: String,
            required: true,
        },
        resumeText: {
            type: String,
            required: true, // extracted text used for AI scoring
        },
        coverLetter: {
            type: String,
            default: '',
        },
        currentStage: {
            type: String,
            default: 'Applied',
        },
        stageHistory: [
            {
                stage: String,
                movedAt: {type: Date, default: Date.now},
                movedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
        aiScore: {
            fitPercentage: {type: Number, default: null},
            matchedSkills: [String],
            missingSkills: [String],
            summary: {type: String, default: ''},
            scoredAt: {type: Date, default: null},
        },
        status: {
            type: String,
            enum: ['active', 'withdrawn', 'rejected', 'hired'],
            default: 'active',
        },
        notes: [
            {
                text: String,
                addedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
    },
    {
        timestamps: true
    }
);

applicationSchema.index({ job: 1, candidate: 1},{unique: true});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
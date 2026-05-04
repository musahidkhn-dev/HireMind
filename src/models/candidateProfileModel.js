import mongoose from "mongoose";

const candidateProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        headline: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
        },
        skills: [
            {
                type: String,
            },
        ],
        experiences: [
            {
                title: String,
                company: String,
                startDate: Date,
                endDate: Date,
                current: {type: Boolean, default: false},
                description: String,
            },
        ],
        education: [
            {
                degree: String,
                institution: String,
                startDate: Date,
                endDate: Date,
                grade: String,
            },
        ],
        resumeUrl: {
            type: String,
            default: '',
        },
        portfolioUrl: {
            type: String,
            default: '',
        },
        linkedinUrl: {
            type: String,
            default: '',
        },
        totalExperienceYears: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true
    }
);

const CandidateProfile = mongoose.model('CandidateProfile', candidateProfileSchema);
export default CandidateProfile
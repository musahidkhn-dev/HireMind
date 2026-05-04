import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import Activity from "../models/activityModel.js";


//----- Company Dashboard Overview ----------------------------------------------
export const getCompanyDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const userJobs = await Job.find({ createdBy: userId }).select('_id');
        const userJobIds = userJobs.map(j => j._id);

        const [ totalJobs, activeJobs, closedJobs, totalApplications, recentJobs, recentApplications, recentActivities ] = await Promise.all([
            // Total Jobs
            Job.countDocuments({ createdBy: userId }),

            // Active Jobs
            Job.countDocuments({ createdBy: userId, status: 'active' }),

            //Closed Jobs
            Job.countDocuments({ createdBy: userId, status: 'closed' }),

            //Total applications across all jobs posted by this user
            Application.countDocuments({ job: { $in: userJobIds } }),

            //Recent 5 Jobs
            Job.find({ createdBy: userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title status applicationCount createdAt'),
            
            //Recent 5 Applications 
            Application.find({ job: { $in: userJobIds } })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate('candidate', 'name email userImage')
                    .populate('job', 'title'),
                
                // Recent 10 Activities
                Activity.find({ 
                    $or: [
                        { user: userId },
                        { metadata: { jobId: { $in: userJobIds } } }
                    ]
                })
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .populate('user', 'name userImage'),
        ])

        //Application by stage
        const applicationsByStage = await Application.aggregate([
            { $match: { job: { $in: userJobIds } } },
            {
                $group: {
                    _id: '$currentStage',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);


        //Application trend last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const applicationTrend = await Application.aggregate([
            {
                $match: {
                    job: { $in: userJobIds },
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt',
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // New applicants this week (last 7 days)
        const newApplicants = await Application.countDocuments({
            job: { $in: userJobIds },
            createdAt: { $gte: sevenDaysAgo }
        });

        return res.status(200).json({
            stats: {
                totalJobs,
                activeJobs,
                closedJobs,
                totalApplications,
                newApplicants,
            },
            applicationsByStage,
            applicationTrend,
            recentJobs,
            recentApplications,
            recentActivities,
        });
    } catch (error) {
        console.error('getCompanyDashboard error:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


//--------- Job State -----------------------------------------------------------------------------

export const getJobStats = async (req, res) => {
    try {
        const companyId = req.user.company;

        // Per job application count + stage breakdown
        const jobStats = await Job.aggregate([
            { $match: { company: companyId } },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'job',
                    as: 'applications',
                },
            },
            {
                $project: {
                    title: 1,
                    status: 1,
                    createdAt: 1,
                    applicationCount: { $size: '$applications' },
                    hiredCount: {
                        $size: {
                            $filter: {
                                input: '$applications',
                                as: 'app',
                                cond: { $eq: ['$$app.currentStage', 'Hired'] },
                            },
                        },
                    },
                    rejectedCount: {
                        $size: {
                            $filter: {
                                input: '$applications',
                                as: 'app',
                                cond: { $eq: ['$$app.currentStage', 'Rejected'] },
                            },
                        },
                    },
                    InterviewCount: {
                        $size: {
                            $filter: {
                                input: '$applications',
                                as: 'app',
                                cond: { $eq: ['$$app.currentStage', 'Interview'] },
                            },
                        },
                    },
                    avgAiScore: { $avg: '$applications.aiScore.fitPercentage' },
                },
            },
            { $sort: { createdAt: -1 } },
        ]);

        return res.status(200).json({ jobStats });
    } catch (error) {
        console.error('getJobStats error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

//--------- Application Stats (Funnel) -------------------------------------------------------------
export const getApplicationStats = async (req, res) => {
    try {
        const companyId = req.user.company;
        const { jobId, days = 30 } = req.query;

        const matchFilter = { company: companyId };

        if(jobId) {
            const { default: mongoose} = await import('mongoose');
            matchFilter.job = new mongoose.Types.ObjectId(jobId);
        }

        //Date range filter
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Number(days));
        matchFilter.createdAt = { $gte: startDate };


        // Funnel by stage
        const funnelData = await Application.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$currentStage',
                    count: { $sum: 1 },
                    avgAiScore: { $avg: '$aiScore.fitPercentage' },
                },
            },
            { $sort: { count: -1 } },
        ]);


        //Time to hire - average days from Applied to Hired
        const timeToHire = await Application.aggregate([
            {
                $match: {
                    ...matchFilter,
                    currentStage: 'Hired',
                },
            },
            {
                $project: {
                    daysToHire: {
                        $divide: [
                            { $subtract: ['$updatedAt', '$createdAt'] },
                            1000 * 60 * 60 * 24 // convert ms to days
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    avgDaysToHire: { $avg: '$daysToHIre'},
                    minDaysToHire: { $avg: '$daysToHire'},
                    maxDaysToHire: { $avg: '$daysToHire'},
                },
            },
        ]);


        // Offer acceptance rete
        const offerStats = await Application.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: null,
                    totalOffers: {
                        $sum: {
                            $cond: [{ $eq: ['$currentStage', 'Offer'] }, 1, 0],
                        },
                    },
                    totalHired: {
                        $sum: {
                            $cond: [{ $eq: ['$currentStage', 'Hired'] }, 1, 0],
                        },
                    },
                    totalRejected: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0],
                        },
                    },
                    totalWithdrawn: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'withdrawn'] }, 1, 0],
                        },
                    },
                },
            },
        ]);


        // Applications per day trend
        const dailyTrend = await Application.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt',
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);


        //Drop off analysis - where candidates are lost
        const dropOffAnalysis = await Application.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$currentStage',
                    total: { $sum: 1 },
                    withdrawn: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'withdrawn'] }, 1, 0],
                        },
                    },
                    rejected: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0],
                        },
                    },
                },
            },
        ]);

        return res.status(200).json({
            funnelData,
            timeToHire: timeToHire[0] || {
                avgDaysToHire: 0,
                minDaysToHire: 0,
                maxDaysToHire: 0,
            },
            offerStats: offerStats[0] || {
                totalOffers: 0,
                totalHired: 0,
                totalRejected: 0,
                totalWithdrawn: 0,
            },
            dailyTrend,
            dropOffAnalysis,
        });
    } catch (error) {
        console.error('getApplicationStats error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

//----- Top Skills in Demand --------------------------------------------------------------------
export const getTopSkills = async (req, res) => {
    try {
        const companyId = req.user.company;

        //Most required Skills across all active jobs
        const topJobSkills = await Job.aggregate([
            {
                $match: {
                    company: companyId,
                    status: 'active',
                },
            },
            { $unwind: '$skills' },
            {
                $group: {
                    _id: { $toLower: '$skills' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 15 },
            {
                $project: {
                    skill: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);


        //Most common skills in candidate profiles who applied
        const topCandidateSkills = await Application.aggregate([
            { $match: { company: companyId} },
            {
                $lookup: {
                    from: 'candidateProfiles',
                    localField: 'candidate',
                    foreignField: 'user',
                    as: 'profile',
                },
            },
            { $unwind: '$profile' },
            { $unwind: '$profile.skills' },
            {
                $group: {
                    _id: { $toLower: '$profile.skills' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 15 },
            {
                $project: {
                    skill: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);


        //Skill gap - skills in demand but not available in candidate pool

        const jobSkillSet = new Set(topJobSkills.map((s) => s.skill ));
        const candidateSkillSet = new Set(topCandidateSkills.map((s) => s.skill));


        const SkillGap = [...jobSkillSet].filter(
            (skill) => !candidateSkillSet.has(skill)
        );

        return res.status(200).json({
            topJobSkills,
            topCandidateSkills,
            SkillGap,
        });
    } catch (error) {
        console.error('getTopSkills error: ', error.message);
        return res.status(500).json({ message: 'Server error'});
    }
};



//------------- Recruiter Performance ---------------------------------------------------------

export const getRecruiterPerformance = async (req, res) => {
    try {
        const companyId = req.user.company;

        const recruiterStats = await Job.aggregate([
            { $match: { company: companyId } },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'job',
                    as: 'applications',
                },
            },
            {
                $group: {
                    _id: '$postedBy',
                    totalJobs: { $sum: 1 },
                    totalApplications: { $sum: { $size: '$applications' } },
                    totalHired: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: '$applications',
                                    as: 'app',
                                    cond: { $eq: ['$app.currentStage', 'Hired'] },
                                },
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'recruiter',
                },
            },
            { $unwind: '$recruiter' },
            {
                $project: {
                    recruiterName: '$recruiter.name',
                    recruiterEmail: '$recruiter.email',
                    totalJobs: 1,
                    totalApplications: 1,
                    totalHired: 1,
                    hireRate: {
                        $cond: [
                            { $eq: ['$totalApplications', 0 ] },
                            0,
                            {
                                multiply: [
                                    { $divide: ['$totalHired', '$totalApplications'] },
                                    100,
                                ],
                            },
                        ],
                    },
                },
            },
            { $sort: { totalHired: -1 } },
        ]);

        return res.status(200).json({ recruiterStats });
    } catch (error) {
        console.error('getRecruiterPerformance error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ------------- Get all activities for a company ---------------------------------------------
export const getActivities = async (req, res) => {
    try {
        const companyId = req.user.company;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const [activities, total] = await Promise.all([
            Activity.find({ company: companyId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate('user', 'name userImage'),
            Activity.countDocuments({ company: companyId })
        ]);

        return res.status(200).json({
            activities,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('getActivities error:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};
import mongoose from "mongoose";
import createNotification from '../utils/createNotification.js';
import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";
import cloudinary from '../config/cloudinary.js';
import sendEmail from '../utils/sendEmail.js';
// import { application } from 'express';


// -------------- Apply to a job -------------------------------------------------------------------

export const applyJob = async (req, res) => {
    
    try {

        const { jobId } = req.params;
        const { coverLetter } = req.body;
        

        // Must have resume file uploaded
        if(!req.file) {
            return res.status(400).json({ message: 'Resume PDF is required' });
        }

        if(req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ message: 'Uploaded file must be a PDF' });
        }

        const job = await Job.findById(jobId).populate('company');
        // console.log(job)
        if(!job) {
            return res.status(404).json({ message: 'Job not found'});
        }

        if(job.status !== 'active') {
            return res.status(400).json({ message: 'This job is not accepting applications' });
        }

        // Check duplicate application
        const existing = await Application.findOne({
            job: new mongoose.Types.ObjectId(jobId),
            candidate: new mongoose.Types.ObjectId(req.user._id),
        });

        if(existing) {
            return res.status(400).json({ success: false, message: 'You have already applied to this job' });
        }

        //Build resume URL - local path for now
        const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/resume/${req.file.filename}`;

        // Create application
        const application = await Application.create({
            job: jobId,
            candidate: req.user._id,
            company: job.company._id,
            resumeUrl,
            resumeText: "Uploaded PDF",
            coverLetter: coverLetter || '',
            currentStage: 'Applied',
            stageHistory: [
                {
                    stage: 'Applied',
                    movedAt: new Date(),
                    movedBy: req.user._id,
                },
            ],
        });

        // Send response immediately
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application,
        });

        // Run non-critical tasks in background
        (async () => {
            try {
                Activity.create({
                    user: req.user._id,
                    company: job.company._id,
                    type: 'application',
                    action: 'applied for',
                    target: job.title,
                    metadata: {
                        applicationId: application._id,
                        jobId: job._id,
                        candidateId: req.user._id,
                    }
                }).catch(err => console.error('Activity log failed', err));

                createNotification({
                    recipient: job.createdBy,
                    type: 'application_received',
                    title: 'New Application Received',
                    message: `${req.user.name} applied for ${job.title}`,
                    data: {
                        jobId: job._id,
                        applicationId: application._id,
                        companyId: job.company
                    },
                }).catch(err => console.error('Notification failed', err));

                Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1} })
                    .catch(err => console.error('Failed to update application count: ', err));

                sendEmail({
                    to: req.user.email,
                    subject: `Application submitted - ${job.title} at ${job.company.name}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Application Received!</h2>
                        <p>Hi ${req.user.name},</p>
                        <p>Your application for <strong>${job.title}</strong> at <strong>${job.company.name}</strong> has been successfully submitted.</p>
                        <p>We will keep you updated on the process of your application.</p>
                        <p>Good luck!</p>
                        </div>
                        `,
                }).catch(emailErr => console.error('Email send failed:', emailErr.message));
            } catch (bgError) {
                console.error('Background task error in applyJob:', bgError.message);
            }
        })();
    } catch (error) {
        // Handle MongoDB duplicate key error (race condition / double-click)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already applied to this job' });
        }
        console.error('applyToJob Error', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// --------- Get candidate's own applications ----------------------------------

export const getMyApplications = async (req, res) => {
    try {
        const { status, stage, page = 1, limit = 10 } = req.query;

        const filter = { candidate: req.user._id };
        if(status) filter.status = status;
        if(stage) filter.currentStage = stage;

        const skip = (page -1)* limit;

        const [applications, total] = await Promise.all([
            Application.find(filter)
            .populate({
                path: 'job',
                select: 'title location jobType salaryRange status company',
                populate: { path: 'company', select: 'name logo location' }
            })
            .populate('company', 'name logo location')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
          Application.countDocuments(filter),
        ]);

        return res.status(200).json({
            applications,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('getMyApplications Error: ', error.message);
        return res.status(500).json({ message: 'Server Error'})
    }
};



// ----- Get all applications for job (recruiter/admin) -------------------------

export const getAllApplications = async (req, res) => {
    try {
        const {jobId} = req.params;
        const { stage, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

        // Verify job was created by this recruiter
        const job = await Job.findOne({
            _id: jobId,
            createdBy: req.user._id,
        });

        if(!job) {
            return res.status(404).json({ message: 'Job not found or access denied' });
        }

        const filter = { job: jobId };
        if(stage) filter.currentStage = stage;

        const skip = (page -1) * limit;


        // Sort options
        const sortOptions = {
            createdAt: { createdAt: -1 },
            aiScore: { 'aiScore.fitPercentage': -1 },
            name: { 'candidate.name': 1 },
        };

        const [ applications, total] = await Promise.all([
            Application.find(filter)
                .populate({
                    path: 'candidate',
                    select: 'name email userImage',
                    populate: { path: 'profile', select: 'headline' }
                })
                .sort(sortOptions[sortBy] || { createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Application.countDocuments(filter),
        ]);

        return res.status(200).json({
            applications,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('getAllApplication Error: ', error.message);
        return res.status(500).json({ message: 'Server Error'});
    }
};


//---------- Get single application detail -----------------------------------

export const getSingleApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('job', 'title description skills requirements pipelineStages createdBy')
            .populate({
                path: 'candidate',
                select: 'name email userImage',
                populate: { path: 'profile', select: 'headline' }
            })
            .populate('stageHistory.movedBy', 'name')
            .populate('notes.addedBy', 'name');

        
        if(!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
    

        // Only the candidate themselves or the recruiter who created the job can view
        const isCandidate = application.candidate._id.toString() === req.user._id.toString();
        const isJobOwner = application.job.createdBy.toString() === req.user._id.toString();


        if(!isCandidate && !isJobOwner) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Flatten headline for frontend convenience
        const applicationData = application.toObject();
        if (applicationData.candidate && applicationData.candidate.profile) {
            applicationData.candidate.headline = applicationData.candidate.profile.headline;
        }

        return res.status(200).json({ application: applicationData });
    
    } catch (error) {
        console.error('getApplicationById error:', error.message);
        return res.status(500).json({ message: 'Server error' });    
    }
};


// --------- Update application stage (Kanban move) ---------------------------

export const updateApplicationStage = async (req, res) => {
    try {
        const { stage, note } = req.body;

        if(!stage) {
            return res.status(400).json({ message: 'Stage is required' });
        }

        const application = await Application.findById(req.params.id)
            .populate('job'); // Only populate job initially for auth check

        if(!application) {
            return res.status(404).json({ message: 'Application not found!' });
        }

        // Only the recruiter who created the job can move stages
        if(application.job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const trimmedStage = stage.trim();

        // Validation stage exists in job pipeline
        const validStages = application.job.pipelineStages;
        if(!validStages.includes(trimmedStage)) {
            return res.status(400).json({
                message: `Invalid stage. Valid stages are: ${validStages.join(', ')}`,
            });
        }

        // Prevent pushing same stage twice in history if no change
        if (application.currentStage === trimmedStage && application.stageHistory.length > 0) {
             return res.status(200).json({ message: 'Application is already in this stage', application });
        }

        const previousStage = application.currentStage;
        application.currentStage = trimmedStage;


        // Track stage history
        application.stageHistory.push({
            stage: trimmedStage,
            movedAt: new Date(),
            movedBy: req.user._id,
        });

        //Add note if provided
        if (note) {
            application.notes.push({
                text: note,
                addedBy: req.user._id,
                addedAt: new Date(),
            });
        }

        await application.save();

        // Send response immediately
        res.status(200).json({
            success: true,
            message: `Application moved to ${stage}`,
            application,
        });

        // Run non-critical tasks in background
        (async () => {
            try {
                // If "Hired", convert candidate to Employee (moved to background)
                if (trimmedStage === 'Hired') {
                    await User.findByIdAndUpdate(application.candidate, {
                        role: 'employee',
                        company: application.company,
                    });
                }

                // Populate extra details needed for notifications
                const fullApp = await Application.findById(application._id)
                    .populate('candidate', 'name email')
                    .populate({
                        path: 'job',
                        populate: { path: 'company', select: 'name' }
                    });

                if (!fullApp) return;

                Activity.create({
                    user: req.user._id,
                    company: fullApp.company,
                    type: 'application',
                    action: `moved ${fullApp.candidate.name} to`,
                    target: trimmedStage,
                    metadata: {
                        applicationId: fullApp._id,
                        jobId: fullApp.job._id,
                        candidateId: fullApp.candidate._id,
                    }
                }).catch(err => console.error('Activity failed', err));

                createNotification({
                    recipient: fullApp.candidate._id,
                    type: 'application_status',
                    title: 'Application Status Updated',
                    message: `Your Application for ${fullApp.job.title} moved to ${stage}`,
                    data: {
                        jobId: fullApp.job._id,
                        applicationId: fullApp._id,
                    },
                }).catch(err => console.error('Notification failed', err));

                sendEmail({
                    to: fullApp.candidate.email,
                    subject: `Application update - ${fullApp.job.title}`,
                    html: `
                       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Application Status Update</h2>
                        <p>Hi ${fullApp.candidate.name},</p>
                        <p>Your application for <strong>${fullApp.job.title}</strong> has been moved from <strong>${previousStage}</strong> to <strong> ${stage}</strong>.</p>
                        ${note ? `<p>Note from recruiter: <em>${note}</em></p>` : ''}
                        <p>Log in to HireMind to view your full application status.</p>
                       </div>
                    `,
                }).catch(emailErr => console.error('Candidate notification email failed:', emailErr.message));
            } catch (bgError) {
                console.error('Background task error in updateApplicationStage:', bgError.message);
            }
        })();

    } catch (error) {
        console.error('updateApplicationStage Error', error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};


// ----------- Withdraw application (candidate Only) ------------------------

export const withdrawApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if(!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Only the candidate can withdraw
        if (application.candidate.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access Denied' });
        }

        if (application.status === 'hired') {
            return res.status(400).json({ message: 'Cannot withdraw an accepted offer' });
        }

        application.status = 'withdrawn';
        application.currentStage = 'Withdrawn';
        await application.save();

        res.status(200).json({ success: true, message: 'Application withdrawn successfully' });

        // Decrement job application count (in background)
        Job.findByIdAndUpdate(application.job, {
            $inc: { applicationCount: -1 },
        }).catch(err => console.error('Failed to decrement application count:', err));
    } catch (error) {
        console.error('withdrawApplication Error:  ', error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};

//--------- Add note to application (recruiter only ) -----------------------

export const addNoteToApplication = async (req, res) => {
    try {
        const { text } = req.body;

        if(!text) {
            return res.status(400).json({ message: 'Note text is required' });
        }

        const application = await Application.findById(req.params.id);

        if(!application) {
            return res.status(404).json({ message: 'Application not found!'});
        }

        if(application.company.toString() !== req.user.company?.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }


        application.notes.push({
            text,
            addedBy: req.user._id,
            addedAt: new Date(),
        });

        await application.save();

        return res.status(200).json({ message: 'Note Added', application });
    } catch (error) {
        console.error('addNoteToApplication Error: ' , error.message);
        return res.status(500).json({ message: 'Server Error'});
    }
};

// --------- Get application stats for recruitment pipeline chart ------------------
export const getStats = async (req, res) => {
    try {
        const stats = await Application.aggregate([
            { $match: { company: req.user.company } },
            {
                $group: {
                    _id: "$currentStage",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format to a clean object for the chart
        const formatted = {
            Applied: 0,
            Screening: 0,
            Interview: 0,
            Offer: 0,
            Hired: 0,
            Rejected: 0
        };

        stats.forEach(item => {
            if (formatted[item._id] !== undefined) {
                formatted[item._id] = item.count;
            }
        });

        res.json(formatted);
    } catch (error) {
        console.error('getStats Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
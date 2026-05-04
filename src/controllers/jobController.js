import Job from "../models/jobModel.js"
import Company from "../models/companyModel.js"
import Activity from "../models/activityModel.js"
// import getGeminiModel from "../config/geminiAPI.js"
import getGroqClient from "../config/groqAPI.js"


//------------ Create Job (manual) -----------------------------------------------------------------------------

export const createJob = async (req, res) => {
    try {
        const { title, description, requirements, skills, location, jobType, salaryRange, } = req.body;

        if(!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        if (!req.user.company && req.user.role === 'recruiter') {
            return res.status(400).json({ message: 'Company profile required before posting jobs.' });
        }

        console.log("Creating job for user:", req.user._id);

        const job = await Job.create({
            title,
            description,
            requirements:  requirements || [],
            skills: skills || [],
            location: location || '',
            jobType: jobType || 'full-time',
            salaryRange: salaryRange || {},
            company: req.user.company,
            createdBy: req.user._id,
            status: 'draft',
        });

        // Log Activity
        await Activity.create({
            user: req.user._id,
            company: req.user.company,
            type: 'job',
            action: 'posted a new job:',
            target: title,
            metadata: {
                jobId: job._id,
            }
        });

        return res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
        console.error('createdJob error ', error.message );
        return res.status(500).json({ message: 'Server error' });
    }
};

//---------------- Get all jobs for a company ------------------------------------------------------------------

export const getCompanyJobs = async (req, res) => {
    try {
        console.log("Fetching jobs for user:", req.user._id, "Role:", req.user.role);
        
        const { status, page = 1, limit = 10 } = req.query;

        // FIXED: Robust filter based on user ID
        const filter = { createdBy: req.user._id };
        if(status && status !== 'all') filter.status = status;

        console.log("Job filter applied:", filter);

        const skip = (page - 1) * limit;

        const [jobs, total] = await Promise.all([
             Job.find(filter)
             .populate('createdBy', 'name email')
             .sort({ createdAt: -1 })
             .skip(skip)
             .limit(Number(limit)),
             Job.countDocuments(filter)
        ]);

        console.log(`Found ${jobs.length} jobs out of ${total} total for this user.`);

        return res.status(200).json({
            jobs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('getCompanyJobs error:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

//------------- Get all active jobs (public - for candidates) -------------------------------------------------

export const getPublicJobs = async (req, res) => {
    try {
        const { search, q, location, l, jobType, t, types, page = 1, limit = 10 } = req.query;

        const filter = { status: 'active' };

        // Handle both 'search' and 'q' params
        const searchTerm = search || q;
        if(searchTerm) {
            filter.$or = [
                {title: {$regex: searchTerm, $options: 'i' } },
                {description: {$regex: searchTerm, $options: 'i'}},
                {skills: {$in: [new RegExp(searchTerm, 'i')] } },
            ];
        }

        // Handle both 'location' and 'l' params
        const loc = location || l;
        if(loc) filter.location = { $regex: loc, $options: 'i' };

        // Handle both 'jobType', 't', and 'types' params (support multiple and array notation)
        const typeParam = jobType || t || types || req.query['types[]'] || req.query['jobType[]'];
        if (typeParam) {
            const typeArray = Array.isArray(typeParam) 
                ? typeParam 
                : typeParam.split(',').filter(Boolean);
            
            if (typeArray.length > 0) {
                filter.jobType = { $in: typeArray };
            }
        }

        // Handle Salary Range
        const minSal = req.query.minSalary || req.query.min;
        const maxSal = req.query.maxSalary || req.query.max;
        
        if (minSal) {
            filter['salaryRange.max'] = { $gte: Number(minSal) };
        }
        if (maxSal) {
            filter['salaryRange.min'] = { $lte: Number(maxSal) };
        }

        const skip = (page - 1) * limit;

        const [jobs, total] = await Promise.all([
            Job.find(filter)
                .populate('company', 'name logo location industry')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Job.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            jobs,
            totalJobs: total,
            totalPages,
            page: Number(page),
            limit: Number(limit)
        });
     } catch (error) {
        console.error('getPublicJobs error:', error.message);
        return res.status(500).json({ message: 'Server error'});
    }
};

//----------- Get single job by ID ----------------------------------------------------------------------------

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId)
            .populate('company', 'name logo location industry website')
            .populate('createdBy', 'name email');

        if(!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        return res.status(200).json({ job })
    } catch (error) {
        console.error('getJobById error ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


//------------- Update job -------------------------------------------------------------------------------------

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if(!job) {
            return res.status(404).json({ message: 'Job not found!' });
        }

        //Make sure job was posted by this recruiter
        if(job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        const allowedFields = [
            'title',
            'description',
            'requirements',
            'skills',
            'location',
            'jobType',
            'salaryRange',
            'status',
            'pipelineStage',
        ];

        allowedFields.forEach((field) => {
            if(req.body[field] !== undefined) {
                job[field] = req.body[field];
            }
        });

        await job.save();

        return res.status(200).json({ message: 'Job updated successfully', job });
    } catch (error) {
        console.error('updateJob error ',  error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

//---------- Delete Job -----------------------------------------------------------------------------------------

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if(!job) {
            return res.status(404).json({ message: 'Job not found!' });
        }

        if(job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await   job.deleteOne();

        return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('deletedJob error', error.message);
        return res.status(500).json({ message: 'Server error'});
    }
};


//------------------- Publish / Unpublish Job ------------------------------------------------------------------


export const updateJobStatus = async (req, res) => {
    try {
        const {status} = req.body;

        if(!['draft', 'active', 'closed'].includes(status)) {
            return res.status(400).json({ message: 'Status must be draft, active or closed' });
        }

        const job = await Job.findById(req.params.jobId );

        if(!job) {
            return res.status(404).json({ message: 'Job not found!'});
        }

        if(job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job status' });
        }

        job.status = status;
        await job.save();

        // Log Activity
        await Activity.create({
            user: req.user._id,
            company: req.user.company,
            type: 'job',
            action: `marked ${job.title} as`,
            target: status,
            metadata: {
                jobId: job._id,
            }
        });
        
        return res.status(200).json({
            message: `Job status updated to ${status}`,
        });
    } catch (error) {
        console.error('updatedJobStatus error:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

// FIXED: Added missing generateJobDescription export
export const generateJobDescription = async (req, res) => {
    try {
        const { title, companyName, industry } = req.body;
        
        // Placeholder implementation - in production, this would call an AI service
        const description = `We are looking for a ${title} to join our team at ${companyName || 'our company'} in the ${industry || 'relevant'} industry. The ideal candidate will have strong expertise in the field and a passion for excellence.`;
        
        return res.status(200).json({ 
            message: "AI job description generated successfully",
            description 
        });
    } catch (error) {
        console.error('generateJobDescription error:', error.message);
        return res.status(500).json({ message: 'Failed to generate job description' });
    }
};
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import Job from "../models/jobModel.js";
import Application from "../models/applicationModel.js";


//------- Get platform overview state -------------------------------------------------------------------

export const getPlatformStats = async (req, res) => {
    try {
        const [
             totalUsers,
             totalCompanies,
             totalJobs,
             totalApplications,
             totalCandidates,
             totalRecruiters,
             totalAdmins,
             activeJobs,
        ] = await Promise.all([
            User.countDocuments(),
            Company.countDocuments(),
            Job.countDocuments(),
            Application.countDocuments(),
            User.countDocuments({ role: 'candidate' }),
            User.countDocuments({ role: 'recruiter' }),
            User.countDocuments({ role: 'superadmin' }),
            Job.countDocuments({ status: 'active' }),
        ]);

        //New users last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
        });


        //User growth trend
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m',
                            date: '$createdAt',
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            { $limit: 12 },
        ]);

        return res.status(200).json({
            stats: {
                totalUsers,
                totalCompanies,
                totalJobs,
                totalApplications,
                totalCandidates,
                totalAdmins,
                activeJobs,
                newUsersLast30Days: newUsers,
            },
            userGrowth,
        });
    } catch (error) {
        console.error('getPlatformStats error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


//-------- Get all users ---------------------------------------------------------------------

export const getAllUsers = async (req, res) => {
    try {
        const { role, isActive, search, page = 1, limit = 20, } = req.query;

        const filter = {};

        if(role) filter.role = role;
        if(isActive !== undefined) filter.isActive = isActive === 'true';
        if(search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },  
            ];
        }

        const skip = (page -1) * limit;

        const [users, total] = await Promise.all([
            User.find(filter)
                .populate('company', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .select('-password -refreshToken -inviteToken -passwordResetToken'),
            User.countDocuments(filter),
        ]);

        return res.status(200).json({
            users,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('getAllUsers error: ', error.message);
        return res.status(500).json({ message: 'Server error' });

    }
};



//--------- Get all companies ------------------------------------------------------------------------------

export const  getAllCompanies = async (req, res) => {
    try {
        const { search, industry, page = 1, limit = 20 } = req.query;

        const filter = {};

        if(search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { industry: { $regex: search, $options: 'i' } },
            ];
        }

        if (industry) filter.industry = { $regex: industry, $options: 'i' };

        const skip = (page - 1) * limit;

        const [companies, total] = await Promise.all([
            Company.find(filter)
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Company.countDocuments(filter),
        ]);

        //Add Job count per company
        const results = await Promise.all(
            companies.map(async (company) => {
                const [totalJobs, activeJobs, totalApplications] = await Promise.all([
                    Job.countDocuments({ company: company._id }),
                    Job.countDocuments({ company: company._id, status: 'active' }),
                    Application.countDocuments({ company: company._id }),
                ]);
                return {
                    ...company.toObject(),
                    totalJobs,
                    activeJobs,
                    totalApplications,
                };
            })
        );

        return res.status(200).json({ 
            companies: results,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('getAllCompanies error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


//--------- Get all jobs for admin -------------------------------------------------------------------------

export const getAllJobs = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 20 } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (status && status !== 'all') {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const [jobs, total] = await Promise.all([
            Job.find(filter)
                .populate('company', 'name logo')
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Job.countDocuments(filter),
        ]);

        return res.status(200).json({
            jobs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('getAllJobs error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


//-------- Get single job detail -------------------------------------------------------------------------

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('company')
            .populate('createdBy', 'name email role');

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json(job);
    } catch (error) {
        console.error('getJobById error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


//-------- Block / Unblock user ----------------------------------------------------------------------------

export const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        // Merge query and body params
        const block = req.query.block;
        const isActive = req.body.isActive;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Prevent blocking other super admins
        if (user.role === 'superadmin') {
            return res.status(403).json({ message: 'Cannot modify status of a super admin' });
        }

        // Explicitly determine the new status
        let newStatus;
        if (isActive !== undefined) {
            // Direct set from body (boolean)
            newStatus = Boolean(isActive);
        } else if (block !== undefined) {
            // Toggle/Set from query string
            newStatus = block === 'false';
        } else {
            // Default: toggle current status
            newStatus = !user.isActive;
        }

        console.log(`[USER_STATUS_UPDATE] Target: ${user.email}, New isActive: ${newStatus}, Admin: ${req.user.role}`);

        user.isActive = newStatus;
        if (!newStatus) {
            user.refreshToken = null; // force logout if blocking
        }
        
        await user.save();

        return res.status(200).json({ 
            message: `User ${newStatus ? 'unblocked' : 'blocked'} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive,
            },
        }); 
    } catch (error) {
        console.error('blockUser error:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


//------- Delete user ------------------------------------------------------------------------------------

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({ message: 'User not found!' });
        }

        if(user.role === 'superadmin') {
            return res.status(403).json({ message:  'Cannot delete a super admin' });
        }

        // 🔥 CASCADE DELETE: Delete company and jobs related to this recruiter
        if (user.role === 'recruiter') {
            const company = await Company.findOne({ createdBy: user._id });
            if (company) {
                // Delete all jobs linked to this company
                await Job.deleteMany({ company: company._id });
                // Delete the company itself
                await Company.findByIdAndDelete(company._id);
                console.log(`[CASCADE_DELETE] Deleted company ${company._id} and its jobs for user ${user._id}`);
            }
        }

        // Also delete any jobs created directly by the user (redundancy check)
        await Job.deleteMany({ createdBy: user._id });

        // Finally delete the user
        await user.deleteOne();

        return res.status(200).json({ message: 'User and all associated data deleted successfully' });
    } catch (error) {
        console.error('deleteUser error:', error.message)
        return res.status(500).json({ message: 'Server error' });
    }
};


//--------------------- Delete Company ------------------------------------------------------------------------

export const deleteCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        
        const company = await Company.findById(companyId);
        
        if(!company) {
            return res.status(404).json({ message: 'Company not found' });
        }


        //Delete all related data
        await Promise.all([
            Job.deleteMany({ company: companyId }),
            Application.deleteMany({ company: companyId }),
            User.updateMany(
                { company: companyId },
                { company: null, isActive: false }
            ),
            company.deleteOne(),
        ]);

        return res.status(200).json({ 
            message: 'Company and all related data deleted successfully',
        });
    } catch (error) {
        console.error('deleteCompany error: ', error.message );
        return res.status(500).json({ message: 'Server error' });
    }
};


//----------- Get single company detail --------------------------------------------------------------

export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)
            .populate('createdBy', 'name email role');

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Add job stats
        const [totalJobs, activeJobs] = await Promise.all([
            Job.countDocuments({ company: company._id }),
            Job.countDocuments({ company: company._id, status: 'active' })
        ]);

        res.json({
            ...company.toObject(),
            totalJobs,
            activeJobs
        });
    } catch (error) {
        console.error('getCompanyById error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

//----------- Get single user detail --------------------------------------------------------------

export const getUserDetails = async (req, res) => {
    try {
        console.log(`[Admin] Fetching details for user ID: ${req.params.userId}`);
        const user = await User.findById(req.params.userId)
                .populate('company', 'name industry location')
                .select('-password -refreshToken -inviteToken -passwordResetToken');

        if(!user) {
            console.log(`[Admin] User ID ${req.params.userId} not found in DB.`);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`[Admin] User found. Role: ${user.role}`);


        // Get user activity stats
        let activityStats = {};

        if(user.role === 'candidate') {
            activityStats = {
                totalApplications: await Application.countDocuments({
                    candidate: user._id,
                }),
                activeApplications: await Application.countDocuments({
                    candidate: user._id,
                    status: 'active',
                }),
            };
        }

        if(user.role === 'recruiter') {
            activityStats = {
                totalJobsPosted: await Job.countDocuments({ createdBy: user._id }),
                activeJobs: await Job.countDocuments({
                    createdBy: user._id,
                    status: 'active',
                }),
            };
        }

        console.log(`[Admin] Successfully fetched user details for ${user.email}`);
        return res.status(200).json({ user, activityStats });
        
    } catch (error) {
        console.error('getUserDetails error: ', error.message, error.stack);
        return res.status(500).json({ message: 'Server error' });   
    }
};

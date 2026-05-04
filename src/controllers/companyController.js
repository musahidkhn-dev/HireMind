import crypto from 'crypto';
import Company from '../models/companyModel.js';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';


// -----Get company profile------------------------------------------------

export const getCompanyProfile = async (req, res) => {
    try {
        console.log("Fetching company for user:", req.user?._id, "Current company ID on user:", req.user?.company);
        
        let companyId = req.user.company;
        let company;

        // Try searching by the linked ID first
        if (companyId) {
            company = await Company.findById(companyId)
                .populate('recruiters', 'name email isActive');
        }

        // Fallback: If no company ID on user, search by createdBy field
        if (!company) {
            console.log("Searching company by creator ID:", req.user._id);
            company = await Company.findOne({ createdBy: req.user._id })
                .populate('recruiters', 'name email isActive');
            
            if (company && (!req.user.company || req.user.company.toString() !== company._id.toString())) {
                // Heal the user record if it's missing or has wrong company link
                console.log("Healing user company reference to:", company._id);
                await User.findByIdAndUpdate(req.user._id, { company: company._id });
                req.user.company = company._id;
            }
        }

        if(!company) {
            console.warn("No company record exists for user:", req.user._id);
            return res.status(404).json({ message: 'Company not found!'});
        }

        return res.status(200).json({ company });
    } catch (err) {
        console.error('getCompanyProfile error:', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

//-----------Update company profile -----------------------------------------

export const updateCompanyProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("Updating company profile for user:", userId);

        const { name, description, industry, website, location, size } = req.body;
        
        // Search by creator to ensure ownership
        let company = await Company.findOne({ createdBy: userId });

        if (!company) {
            console.log("Company not found. Creating new company for user:", userId);
            
            // Basic name required for creation
            if (!name) {
                return res.status(400).json({ message: "Company name is required to create a profile" });
            }

            company = new Company({
                name,
                description,
                industry,
                website,
                location,
                size,
                createdBy: userId,
                recruiters: [userId]
            });

            if (req.file) {
                company.logo = req.file.path;
            }

            await company.save();

            // Sync user model
            await User.findByIdAndUpdate(userId, { company: company._id });
            req.user.company = company._id;

            return res.status(201).json({
                success: true,
                message: 'Company profile created successfully',
                company
            });
        }

        // Update existing company
        console.log("Updating existing company:", company._id);

        if (req.file) {
            // Delete old logo logic...
            if (company.logo && company.logo.includes('cloudinary')) {
                try {
                    const urlParts = company.logo.split('/');
                    const fileWithExt = urlParts[urlParts.length - 1];
                    const publicId = `HireMind/companyLogo/${fileWithExt.split('.')[0]}`;
                    const { v2: cloudinary } = await import('cloudinary');
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    console.error('Old logo delete failed:', error.message);
                }
            }
            company.logo = req.file.path;
        }

        if(name) company.name = name;
        if(description !== undefined) company.description = description;
        if(industry !== undefined) company.industry = industry;
        if(website !== undefined) company.website = website;
        if(location !== undefined) company.location = location;
        if(size !== undefined) company.size = size;

        await company.save();

        // Ensure user record is synced if it wasn't
        if (!req.user.company || req.user.company.toString() !== company._id.toString()) {
            await User.findByIdAndUpdate(userId, { company: company._id });
        }

        return res.status(200).json({ 
            success: true,
            message: 'Company profile updated successfully', 
            company 
        });
    } catch (err) {
        console.error('updateCompanyProfile error:', err.message );
        return res.status(500).json({ message : 'Server error', error: err.message });
    }
};

//---------------- Invite recruiter --------------------------------------------------------------------

export const inviteRecruiter = async (req, res) => {
    try {
        const { email, name } = req.body;
        
        if(!email || !name) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const company = await Company.findById(req.user.company);
        if(!company) {
            return res.status(404).json({ message: 'Company not found!' });
        }

        //Check if user already exists and is already a recruiter
        const existingUser = await User.findOne({ email })
        if(existingUser && existingUser.isActive) {
            return res.status(409).json({ message: 'A user with this email already exists' });
        }
        
        
        
        
        //Generate invite token
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
        
        console.log("RAW TOKEN: ", rawToken)
        if(existingUser && !existingUser.isActive) {
            existingUser.inviteToken = hashedToken;
            existingUser.inviteTokenExpiry = expiry;

            await existingUser.save();

            return res.json({ message: "Invite resent successfully" });
        }
        const companyId = req.user.company

        //Create recruiter account with pending status
        const recruiter = await User.create({ 
            name,
            email,
            password: rawToken,  // temporary password, they will reset via invite
            role: 'recruiter',
            company: companyId,
            isActive: false, // inactive until they accept invite
            inviteToken: hashedToken, 
            inviteTokenExpiry: expiry,
        });

        // Add to company recruiter array
        company.recruiters.push(recruiter._id);
        await company.save();

        // Send invite email
        const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${rawToken}`;

        await sendEmail({
            to: email,
            subject: `You're invited to join ${company.name} on HireMind`,
            html: `
                    <div style="font-family: Arial, sans-serif: max-width: 600; margin: 0 auto;">
                    <h2> Hi ${name}, </h2>
                    <p>You have been invited to join <strong>${company.name}</strong> as a recruiter on HireMin. </p>
                    <p>Click the button below to set your password and activate your account:</p>
                    <a href="${inviteUrl}"
                        style="display:inline-block;padding:12px 24px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;margin:16xp 0;>
                        Accept Invitation
                        </a>
                        <p>This invite link expires in <strong>48 hours</strong> </p>
                        <p>If you did not expect this invitation, you can safely ignore this email.</p>
                        </div>
                        `,
        });
        return res.status(201).json({
            message: `Invite sent to ${email}`,
            recruiter: {
                id: recruiter.id,
                name: recruiter.name,
                email: recruiter.email,
                isActive: recruiter.isActive,
            },
        });
    } catch (err) {
        console.error('InviteRecruiter error: ', err.message );
        return res.status(500).json({ message: 'Server error' });
    }
};

//------------- Accept Invite ------------------------------------------------------------------------

export const acceptInvite = async (req, res) => {
    try {
        const { token, password } = req.body;

        if(!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 character', });
        }

        

        //Hash the raw token to compare with DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        // console.log(hashedToken)
        const recruiter = await User.findOne({
            inviteToken: hashedToken,
            inviteTokenExpiry: { $gt: Date.now() },
        });
        
        console.log("DB TOKEN: ", recruiter?.inviteToken)
        if(!recruiter) {
            return res.status(400).json({ message: 'Invite Token is invalid or has expired' });
        }


        if(recruiter.isActive) {
            return res.status(400).json({ message: "Account already activated",});
        }
        // Activate recruiter and set their real password
        recruiter.password = password;
        recruiter.isActive = true;
        recruiter.inviteToken = null;
        recruiter.inviteTokenExpiry = null;
        await recruiter.save();

        return res.status(200).json({ message: 'Account activated successfully. You can now log in.' });
    } catch (err) {
        console.error('acceptInvite error: ', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


//---------- Remove recruiter ------------------------------------------------------------------------
export const removeRecruiter = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        const company = await Company.findById(req.user.company);
        if(!company) {
            return res.status(404).json({ message: 'Company not found!' });
        }

        //Remove from company recruiters array
        company.recruiters = company.recruiters.filter(
            (id) => id.toString() !== recruiterId
        );
        await company.save();

        //Deactivate the recruiter account
        await User.findByIdAndUpdate(recruiterId, { isActive: false });

        return res.status(200).json({ message: 'Recruiter removed successfully' });
    } catch (err) {
        console.err('removeRecruiter error: ', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
}



//------ Get all team members for a company (Admin + Recruiters + Employees) ---------------------------------
export const getTeam = async (req, res) => {
    try {
        const team = await User.find({
            company: req.user.company,
            role: 'recruiter'
        }).select('name email userImage isActive role createdAt');

        return res.status(200).json({ 
            success: true,
            count: team.length,
            team 
        });
    } catch (error) {
        console.error('getTeam error: ', error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};

//------ Get all recruiter for a company ------------------------------------------------------

export const getRecruiters = async (req, res) => {
    try {
        const recruiters = await User.find({
            company: req.user.company,
            role: 'recruiter',
        }).select('name email userImage isActive createdAt');

        return res.status(200).json({ recruiters });
    } catch (error) {
        console.error('getRecruiters error: ', error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};

//------ Get public company profile ------------------------------------------------------

export const getPublicCompanyProfile = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if(!company) {
            return res.status(404).json({ message: 'Company not found!'});
        }

        // Get active jobs for this company
        const Job = (await import('../models/jobModel.js')).default;
        const jobs = await Job.find({ company: company._id, status: 'active' }).sort({ createdAt: -1 });

        return res.status(200).json({ company, jobs });
    } catch (err) {
        console.error('getPublicCompanyProfile error', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

//------ Follow Company ------------------------------------------------------

export const followCompany = async (req, res) => {
    try {
        const userId = req.user.id;
        const companyId = req.params.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { followingCompanies: companyId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Company followed successfully",
            followingCompanies: user.followingCompanies
        });
    } catch (error) {
        console.error('followCompany error', error.message);
        return res.status(500).json({ message: "Follow failed" });
    }
};

//------ Unfollow Company ------------------------------------------------------

export const unfollowCompany = async (req, res) => {
    try {
        const userId = req.user.id;
        const companyId = req.params.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { followingCompanies: companyId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Company unfollowed successfully",
            followingCompanies: user.followingCompanies
        });
    } catch (error) {
        console.error('unfollowCompany error', error.message);
        return res.status(500).json({ message: "Unfollow failed" });
    }
};



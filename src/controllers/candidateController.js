import User from "../models/userModel.js";
import CandidateProfile from "../models/candidateProfileModel.js";
import Application from "../models/applicationModel.js";
import cloudinary from "../config/cloudinary.js";

//------Get candidate profile --------------------------------------------------------------------

export const getCandidateProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email userImage createdAt");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    console.error("getCandidateProfile Error: ", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

//---- Update candidate profile ------------------------------------------------------------------
export const updateCandidateProfile = async (req, res) => {
  try {

    
    const {
      name,
      headline,
      bio,
      skills,
      experience,
      education,
      portfolioUrl,
      linkedinUrl,
      totalExperienceYears,
    } = req.body;

    const profile = await CandidateProfile.findOne({ user: req.user._id });

    if(!profile) {
        return res.status(404).json({ message: 'Profile not found!' });
    }

    // Update User model fields (name)
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    if(headline !== undefined) profile.headline = headline;
    if(bio !== undefined) profile.bio = bio;
    if(skills !== undefined) profile.skills = skills;
    if(experience !== undefined) profile.experiences = experience;
    if(education !== undefined) profile.education = education; 
    if(portfolioUrl !== undefined) profile.portfolioUrl = portfolioUrl;
    if(linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if(totalExperienceYears !== undefined) profile.totalExperienceYears = totalExperienceYears;

    await profile.save();

    const updatedProfile = await CandidateProfile.findOne({ user: req.user._id }).populate("user", "name email userImage");

    return res.status(200).json({ 
      message: 'Profile updated successfully', 
      profile: updatedProfile 
    });

  } catch (error) {
    console.error('updateCandidateProfile Error: ', error.message);
    return res.status(500).json({ message: 'Server Error'});
  }
};


//------- Upload Resume -----------------------------------------------------------------------

export const uploadResume = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF file' });
        }

        const profile = await CandidateProfile.findOne({ user: req.user._id });

        if(!profile) {
            return res.status(404).json({ message: 'Profile not found!' });
        }

        // Delete old resume from cloudinary if exists
        if(profile.resumeUrl) {
            try {
                //Extract public_id from old URL
                const urlParts = profile.resumeUrl.split('/');
                const fileWithExt = urlParts[urlParts.length -1];
                const publicId = `HireMind/resume/${fileWithExt.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId, {resource_type: 'raw' });
            } catch (error) {
                console.error('Old resume delete error:' ,  error.message);
                // Don't block the upload if old delete fails
            }
        }

        //Save new  resume URL
        profile.resumeUrl = req.file.path;
        await profile.save();
        

        // Also update user model profileImage if it's an profileImage upload
        await User.findByIdAndUpdate( req.user._id, {
            //Store resume reference on user to for quick access
        });

        return res.status(200).json({ 
            message: 'Resume uploaded successfully',
            resumeUrl: req.file.path,
        });
         
    } catch (error) {
        console.error('uploadResume Error: ', error.message);
        return res.status(500).json({ message: 'Server Error'});
    }
};



//------------ Get Resume ------------------------------------------------------------------------

export const getResume = async (req, res) => {
    try {
        const profile = await CandidateProfile.findOne({
            user: req.user._id,
        }).select('resumeUrl');

        if(!profile) {
            return res.status(404).json({ message: 'Profile not found!'});
        }

        if(!profile.resumeUrl) {
            return res.status(404).json({ message: 'No resume uploaded yet'});
        }

        return res.status(200).json({ resumeUrl: profile.resumeUrl });
    } catch (error) {
        console.error('getResume Error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


// ---------- Delete Resume ---------------------------------------------------------------------------

export const deleteResume = async (req, res) => {
    try {
        const profile = await CandidateProfile.findOne({ user: req.user._id });

        if(!profile || !profile.resumeUrl) {
            return res.status(404).json({ message: 'No resume found to delete' });
        }


        // Delete from cloudinary
        try {
            const urlParts = profile.resumeUrl.split('/');
            const fileWithExt = urlParts[urlParts.length - 1];
            const publicId = `HireMind/resume/${fileWithExt.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        } catch (error) {
            console.error('Cloudinary delete error: ', error.message);
        }

        profile.resumeUrl = '';
        await profile.save();

        return res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('deleteResume Error: ', error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};


//------- Upload profileImage ---------------------------------------------------------------------

export const uploadProfileImage = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: 'No file uploaded or file type not supported' });
        }

        console.log("File uploaded to Cloudinary:", req.file.path);

        const userId = req.user._id;

        // Fetch user to get old image ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old profileImage from cloudinary if exists
        if(user.userImage && user.userImage.includes('cloudinary')) {
            try {
                const urlParts = user.userImage.split('/');
                const fileWithExt = urlParts[urlParts.length - 1];
                const publicId = `HireMind/profileImage/${fileWithExt.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            } catch (error) {
                console.error('Old profileImage delete error: ', error.message);
            }
        }

        // Update user image
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { userImage: req.file.path },
            { new: true }
        );

        return res.status(200).json({
            message: 'Profile image uploaded successfully',
            userImage: updatedUser.userImage,
        });
    } catch (error) {
        console.error('uploadProfileImage error: ', error.message);
        return res.status(500).json({ message: 'Internal server error during upload' });
    }
};



//--------- Get public candidate profile (for recruiters) ------------------------------------------

export const getPublicCandidateProfile = async (req, res) => {
    try {
        const { candidateId } = req.params;

        const profile = await CandidateProfile.findOne({
            user: candidateId,
        }).populate('user', 'name email userImage createdAt' );

        if(!profile) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        // Return profile without sensitive data
        const publicProfile = {
            name: profile.user.name,
            profileImage: profile.user.userImage,
            headline: profile.headline,
            bio: profile.bio,
            skills: profile.skills,
            experiences: profile.experiences,
            education: profile.education,
            portfolioUrl: profile.portfolioUrl,
            linkedinUrl: profile.linkedinUrl,
            totalExperienceYears: profile.totalExperienceYears ,
        };

        return res.status(200).json({ profile: publicProfile });
    } catch (error) {
        console.error('getPublicCandidateProfile error: ', error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};


//------ Get Candidate dashboard stats -----------------------------------------------------------

export const getCandidateDashboard = async (req, res) => {
    try {
        const candidateId = req.user._id;

        const [
            totalApplications,
            activeApplications,
            interviewApplications,
            offerApplications,
            recentApplications,
        ] = await Promise.all([
            Application.countDocuments({ candidate: candidateId }),
            Application.countDocuments({ candidate: candidateId, status: 'active' }),
            Application.countDocuments({ candidate: candidateId, currentStage: 'Interview' }),
            Application.countDocuments({ candidate: candidateId, currentStage: 'Offer' }),
            Application.find({ candidate: candidateId })
                .populate('job', 'title location jobType')
                .populate('company', 'name logo')
                .sort({ createdAt: -1 })
                .limit(5),
        ]);

        return res.status(200).json({
             stats: {
                 totalApplications,
                 activeApplications,
                 interviewApplications,
                 offerApplications,
                },
                recentApplications,
            });
    } catch (error) {
        console.error('getCandidateDashboard error: ', error.message);
        return res.status(500).json({ message: 'Server Error '});
    }
}
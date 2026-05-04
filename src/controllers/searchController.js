import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import CandidateProfile from "../models/candidateProfileModel.js";


//---------- Advanced Job Search ------------------------------------------------------------------------
export const searchJobs = async (req, res) => {
    try {
        const {
            q,
            location,
            jobType,
            jobId,
            minSalary,
            maxSalary,
            skills,
            experience,
            page = 1,
            limit = 10,
            sortBy = 'createdAt', 
        } = req.query;
        console.log(req.query)
        const filter = { status: 'active' };

        //Full text search on title and description
        if(q) {
            filter.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { skills: { $in: [new RegExp(q, 'i')] } },
                { requirements: { $in: [new RegExp(q, 'i')] } },
            ];
        }


        // Location filter
        if(location) {
            filter.location = { $regex: location, $options: 'i' };
        }


        //Job type filter
        if(jobType) {
            filter.jobType = jobType;
        }


        // Salary range filter
        if (minSalary || maxSalary) {
            filter['salaryRange.min'] = {};
            if(minSalary) filter['salaryRange.min'].$gte = Number(minSalary);
            if(maxSalary) filter['salaryRange.min'].$gte = Number(maxSalary);
        }

        console.log(skills)

        // Skills filter - match any of the provided skills
        if(skills) {
            const skillArray = skills.split(',').map((s) => s.trim());
            filter.skills = {
                $in: skillArray.map((s) => new RegExp(s, 'i')),
            };
        }


        // Sort options
        const sortOptions = {
            createdAt: { createdAt: -1 },
            salary: { 'salaryRange.max': -1 },
            applications: { applicationCount: -1 },
        };

        const skip = (page -1) * limit;

        const [jobs, total] = await Promise.all([
            Job.find(filter)
                .populate('company', 'name logo location industry size')
                .sort(sortOptions[sortBy] || { createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .select('-aiInterviewQuestions'),
            Job.countDocuments(filter),
        ]);


        // Add relevance score if searching by query
        let results = jobs;
        if(q) {
            results = jobs.map((job) => {
                let relevanceScore = 0;
                const query = q.toLowerCase();

                if(job.title.toLowerCase().includes(query)) relevanceScore += 10;
                if(job.skills.some((s) => s.toLowerCase().includes(query))) relevanceScore += 5;
                if(job.description.toLowerCase().includes(query)) relevanceScore += 2;

                return { ...job.toObject(), relevanceScore };
            });

            if (sortBy === 'relevance') {
                results.sort((a, b) => b.relevanceScore - a.relevanceScore);
            }
        }

        return res.status(200).json({
            results,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
                hasMore: skip + jobs.length < total,
            },
            filters: { q, location, jobType, skills, minSalary, maxSalary },
        });
    } catch (error) {
        console.error('searchJobs error:', error.message);
        return res.status(500).json({ message: 'Server error'})
    }
};



//-------------------- Search Candidates (recruiter only) -----------------------------------------

export const searchCandidates = async (req, res) => {
    try {
        const {
            q,
            skills,
            minExperiences,
            maxExperiences,
            profile,
            location,
            page = 1,
            limit = 10,
        } = req.query;


        // Build profile filter
        const profileFilter = {};

        
        // Skills filter
        if (skills) {
            const skillsArray = skills.split(',').map((s) => s.trim());
            profileFilter.skills = {
                $in: skillsArray.map((s) => new RegExp(s, 'i')),
            };
        }


        // Experience filter
        if(minExperiences || maxExperiences) {
            profileFilter.totalExperienceYears = {};
            if(minExperiences) {
                profileFilter.totalExperienceYears.$gte = Number(minExperience);
            }
            if(maxExperiences) {
                profileFilter.totalExperienceYears.$lte = Number(maxExperiences);
            }
        }


        // Headline or bio search
        if(q) {
            profileFilter.$or = [
                { headline: { $regex: q, $options: 'i'} },
                { bio: { $regex: q, $options: 'i' } },
                { skills: { $in: [new  RegExp(q,'i')] } },
            ];
        }

        const skip = (page - 1) * limit;

        const [profiles, total] = await Promise.all([
            CandidateProfile.find(profileFilter)
                .populate('user', 'name email userImage createdAt')
                .sort({ totalExperienceYears: -1 })
                .skip(skip)
                .limit(Number(limit))
                .select('-resumeUrl'), // don't expose resume URL in search      
            CandidateProfile.countDocuments(profileFilter),
        ]);


        //Format results - hide sensitive info
        const results = profiles.map((profile) => ({
            candidateId: profile.user._id,
            name: profile.user.name,
            profileImage: profile.user.userImage,
            headline: profile.headline,
            skills: profile.skills,
            totalExperienceYears: profile.totalExperienceYears,
            education: profile.education,
            portfolioUrl: profile.portfolioUrl,
            linkedinUrl: profile.linkedinUrl,
        }));

        return res.status(200).json({
            results,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
                hasMore: skip + profiles.length < total,
            },
        });
    } catch (error) {
        console.error('searchCandidates error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};



//---------- Search Companies (public) -----------------------------------------------------------

export const searchCompanies = async (req, res) => {
    try {
        const { q, companyId, industry, size, page = 1, limit = 10 } = req.query;

        const filter = {};

        if(q) {
            filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { industry: { $regex: q, $options: 'i'  } },
            ];
        }

        if(industry) filter.industry = { $regex: industry, $options: 'i' };
        if(size) filter.size = size;

        const skip = (page -1) *limit;

        const [companies, total] = await Promise.all([
            Company.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .select('name description industry location size logo website'),

            Company.countDocuments(filter)
        ]);


        // Add active job count per company
        const results = await Promise.all(
            companies.map(async (company) => {
                const activeJobs = await Job.countDocuments({
                    company: companyId,
                    status: 'active',
                });
                return {...company.toObject(), activeJobs};
            })
        );

        return res.status(200).json({
            results,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
                hasMore: skip + companies.length < total,
            },
        });
    } catch (error) {
        console.error('searchCompanies error: ', error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};

//--------- Get Search Suggestions (autocomplete) -------------------------------------------------------

export const getSearchSuggestions = async (req, res) => {
    try {
        const { q, type = 'jobs' } = req.query;

        if(!q || q.length < 2) {
            return res.status(200).json({ suggestions: [] });
        }

        let suggestions = [];

        if(type === 'jobs') {
            const jobs = await Job.find({
                status: 'active',
                title: { $regex: q, $options: 'i' },
            })
                .limit(5)
                .select('title')

            suggestions = jobs.map((j)  => ({
                text: j.title,
                type: 'job'
            }));
        }

        if(type === 'skills') {
            const jobs = await Job.find({
                status: 'active',
                skills: { $in: [new RegExp(q, 'i')] },
            })
                .limit(10)
                .select('skills');


            const allSkills = jobs.flatMap((j) => j.skills);
            const matchSkills = [
                ...new Set(
                    allSkills.filter((s) => 
                      s.toLowerCase().includes(q.toLowerCase())
                    )
                ),
            ].slice(0, 8);

            suggestions = matchSkills.map((s) => ({
                text: s,
                type: 'skills',
            }));
        }

        if(type === 'companies') {
            const companies = await Company.find({
                name: { $regex: q, $options: 'i' },
            })
                .limit(5)
                .select('name');
            
            suggestions = companies.map((c) => ({
                text: c.name,
                type: 'company',
            }));
        }

        return res.status(200).json({ suggestions });
    } catch (error) {
        console.error('getSearchSuggestions error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};
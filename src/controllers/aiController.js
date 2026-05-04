import getGroqClient from "../config/groqAPI.js";
import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import CandidateProfile from "../models/candidateProfileModel.js";


// ------------- Helper: call Groq and parse JSON safely ------------------------------


const askGroq = async (systemPrompt, userPrompt) => {
    const groq = getGroqClient();

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 2000,
    });

    const rawText = response.choices[0].message.content.trim();

    // Strip markdown backticks if model added them
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if(!jsonMatch) {
        throw new Error('AI returned invalid JSON response');
    }

    return JSON.parse(jsonMatch[0]);
};

//---------- Resume Scorer ----------------------------------------------------------------------

export const scoreResume = async (req, res) => {
    try {
        
        const applicationId = req.query.applicationId || req.body.applicationId;
        
        if(!applicationId) {
            return res.status(400).json({ message: 'applicationId is required' });
        }
        
        //Get application with job details
        const application = await Application.findById(applicationId)
                .populate('job', 'title description skills requirements')
                .populate('candidate', 'name email');

        if(!application) {
            return res.status(404).json({ message: 'Application not found!'});
        }
        // Verify company ownership
        if(application.company.toString() !== req.user.company?.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        // console.log(application)
        // console.log(application.company)

        //Get candidate profile for skills
        const candidateProfile = await CandidateProfile.findOne({ user: application.candidate._id, });

        if(!candidateProfile) {
            return res.status(404).json({ message: 'Candidate profile not found!'});
        }
        // console.log(application)
        // console.log("REQUIREMENTS:  ",application.job.requirements)
        
        
        const jobDescription = `
        Title: ${application.job.title}
        Description: ${application.job.description}
        Required Skills: ${application.job.skills.join(', ')}
        Requirements: ${application.job.requirements.join(', ')}
        `;
        
        const candidateInfo = `
        Candidate Skills: ${candidateProfile.skills.join(', ')}
        Experience Years: ${candidateProfile.totalExperienceYears}
        Headline: ${candidateProfile.headline}
        Bio: ${candidateProfile.bio}
        Experience: ${candidateProfile.experiences.map((e) => `${e.title} at ${e.company}`).join(', ')}
        Education: ${candidateProfile.education.map((e) => `${e.degree} from ${e.institution}`).join(', ')}
        `;
        const systemPrompt = `You are an expert technical recruiter and resume evaluator.
        Analyze resumes against job description and provide accurate, fair assessments.
        Always response with valid JSON only. No markdown, no backticks, no extra text.`;

        const userPrompt = `
        Analyze this candidate against the job description and return a JSON score report.
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        CANDIDATE PROFILE:
        ${candidateInfo}
        
        
        Return ONLY this JSON structure:
        {
            "fitPercentage": <number 0-100>,
            "matchedSkills": ["skill1", "skill2"],
            "missingSkills": ["skill1", "skill2"],
            "strengths": ["strength1", "strength2", "strength3"],
            "weaknesses": ["weakness1", "weakness2"],
            "summary": "2-3 sentence overall assessment of the candidate fit",
            "recommendation": "Strong Yes / Yes / Maybe / No",
            "experienceMatch": <number 0-100>,
            "skillsMatch": <number 0-100>,
            "educationMatch": <number 0-100>
        }
        `;

        const scored = await askGroq(systemPrompt, userPrompt);

        // Save AI score to application 
        application.aiScore = {
            fitPercentage: scored.fitPercentage,
            matchedSkills: scored.matchedSkills,
            missingSkills: scored.missingSkills,
            summary: scored.summary,
            scoredAt: new Date(),
        };

        await application.save();

        return res.status(200).json({ message: 'Resume scored successfully', score: scored, applicationId, });

    } catch (error) {
        console.error('resumeScore Error', error.message);
        return res.status(500).json({ message: 'Server Error during resume scoring ' });
    }
}


//---------- Bulk Score all applications for a job ---------------------------------

export const bulkScoreResumes = async (req, res) => {
try {
        
    const jobId = req.query.jobId || req.body.jobId;
    
    if(!jobId) {
        return res.status(400).json({ message: 'jobId is required' });
    }

    const job = await Job.findOne({ _id: jobId, company: req.user.company, });

    if(!job) {
        return res.status(404).json({ message: 'Job not found or access denied' });
    }

    
    // Get all active applications for this job that haven't been scored
    const applications = await Application.find({
        job: jobId,
        status: 'active',
        'aiScore.fitPercentage': null,
    }).populate('candidate', 'name email'); 


    if(applications.length === 0) {
        return res.status(200).json({
            message: 'No unscored applications found!',
            scored: 0,
        });
    }


    const results = [];

    // Score each application sequentially to avoid rate limits
    for(const application of applications) {
        try {
            const candidateProfile = await CandidateProfile.findOne({
                user: application.candidate._id,
            });

            if(!candidateProfile) {
                results.push({
                    applicationId: application._id,
                    error: 'Candidate profile not found',
                });
                continue;
            }

            const jobDescription = `
                Title: ${job.title}
                Description: ${job.description}
                Required Skills: ${job.skills.join(', ')}
                Requirements: ${job.requirements.join(', ')}
            `;

            const candidateInfo = `
                Skills: ${candidateProfile.skills.join(', ')}
                Experience Years: ${candidateProfile.totalExperienceYears}
                Experience: ${candidateProfile.experiences
                    .map((e) => `${e.title} at ${e.company}`)
                    .join(', ')}
                `;

            const systemPrompt = `You are an expert recruiter. Score resumes against job description. 
            Always respond with valid JSON only. No markdown, no backticks.`;


            const userPrompt =  ` 
                Score this candidate against the job. Return ONLY this JSON:
                {
                    "fitPercentage": <number 0-100>,
                    "matchedSkills": ["skill1", "skill2"],
                    "missingSkills": ["skill1", "skill2"],
                    "summary": "brief 1-2 sentence assessment",
                    "recommendation": "Strong Yes/ Yes / Maybe / No"
                }

                JOB: ${jobDescription}
                CANDIDATE: ${candidateInfo}
            `;

            const scored = await askGroq(systemPrompt, userPrompt);
            
            application.aiScore = {
                fitPercentage: scored.fitPercentage,
                matchedSkills: scored.matchedSkills,
                missingSkills: scored.missingSkills,
                summary: scored.summary,
                scoredAt: new Date(),
            };

            await application.save();

            results.push({
                applicationId: application._id,
                candidateName: application.candidate.name,
                fitPercentage: scored.fitPercentage,
                recommendation: scored.recommendation,
            });
        } catch (innerErr) {
            console.error(`Score failed for application ${application._id}:`, innerErr.message);
            results.push({
                applicationId: application._id,
                error: 'Scoring failed for this candidate',
            });
        }
    }

    // Sort by fit percentage descending
    results.sort((a, b) => (b.fitPercentage || 0) - (a.fitPercentage || 0));

    return res.status(200).json({
        message: `Scored ${results.length} applications`,
        scored: results.length,
        results,
    });

   
    
   } catch (error) {
    console.error('bulkScoreResumes error', error.message);
    return res.status(500).json({ message: 'Server Error during bulk scoring' });
   }
     
};
 //--------- Skill Extractor ------------------------------------------------------------------------

    export const extractSkills = async (req, res) => {
        try {
            const {text} = req.body;

            if(!text) {
                return res.status(400).json({ message: 'Text is required for skill extraction'});
            }

            if(text.length < 20) {
                return res.status(400).json({ message: 'Text is too short for skill extraction'});
            }

            const systemPrompt = `You are an expert at identifying technical and soft skills from text.
            Always respond with valid JSON only. No markdown, no extra text.`;

            const userPrompt = `
            Extract all skills from the following text.
            Categorize them into technical skills, soft skills, and tools/technologies.
            
            TEXT:
            ${text}

            Return ONLY this JSON structure:
            {
                "technicalSkills": ["skill1", "skill2"],
                "softSkills": ["skill1", "skill2"],
                "toolsAndTechnologies": ["tool1", "tool2"],
                "programmingLanguages": ["lang1", "lang2"],
                "frameworks": ["framework1", "framework2"],
                "allSkills": ["all", "skills", "combined"],
                "experienceLevel": "Junior / Mid-level / Senior / Lead",
                "primaryDomain": "e.g. Frontend, Backend, Full Stack, DevOps, Data Science"
            }
        `;

        const extracted = await askGroq(systemPrompt, userPrompt);

        return res.status(200).json({
            message: 'Skills extracted successfully',
            extracted,
        });
        } catch (error) {
            console.error('extractSkills Error: ', error.message);
            return res.status(500).json({ message: 'Server error during skill extraction'}); 
        }
    }

    
      //----- Interview Question Generator ----------------------------------------------------------------------

    export const interviewQuestionGenerator = async (req, res) => {
        try {
            const { jobId, applicationId, questionCount = 10 } = req.body;
            
              
            if(!jobId) {
                return res.status(400).json({ message: 'Job is required' });
            }

            const job = await Job.findOne({ _id: jobId, company: req.user.company });

            if(!job) {
                return res.status(404).json({ message: 'Job not found or access denied!'});
            }

            //Get Candidate info if applicationId provide for personalized questions
            let candidateContext = '';
            if(applicationId) {
                const application = await Application.findById(applicationId).populate('candidate', 'name');
                
                // console.log(application)
              

                if(application) {
                    const profile = await CandidateProfile.findOne({
                        user: application.candidate._id,
                    });
                    
                    // console.log(profile)
                if(profile) {
                    candidateContext = ` 
                        Candidate Skills: ${profile.skills.join(', ')}
                        Experiences: ${profile.experiences.map((e) => `${e.title} at ${e.company}`).join(', ')}
                        Year of Experience: ${profile.totalExperienceYears}
                    `;
                }
             


            }
        }


        const systemPrompt = ` You are a senior technical interviewer and HR expert.
        Generate relevant, insightful interview questions.
        Always respond with valid JSON only. No markdown, no backticks, no extra text.`;

        const userPrompt = `
        Generate ${questionCount} interview question for the following role.
        Mix behavioral, technical, and situational question.
        
        
        JOB TITLE: ${job.title}
        JOB DESCRIPTION: ${job.description}
        REQUIRED SKILLS: ${job.skills.join(', ')}
        REQUIREMENTS: ${job.requirements.join(', ')}
        ${candidateContext ? `CANDIDATE CONTEXT: ${candidateContext}`: ''}
        
        
        Return ONLY this JSON structure: 
        {
            "behavioral": [
          { "question": "question text", "purpose": "what this question evaluates" }
             ],
             "technical": [
          { "question": "question text", "expectedAnswer": "key points to look for" }
            ],
            "situational": [
          { "question": "question text", "purpose": "what this question evaluates" }
            ],
            "roleSpecific": [
          { "question": "question text", "purpose": "what this question evaluates" }
            ],
            "cultureAndMotivation": [
          { "question": "question text", "purpose": "what this question evaluates" }
            ]
        }
       
      `;

      const questions = await askGroq(systemPrompt, userPrompt);


      //Save questions to job if not already saved 
        const allQuestions = [
            ...(questions.behavioral || []).map((q) => ({
                question: q.question,
                type: 'behavioral',
            })),
            ...(questions.technical || []).map((q) => ({
                question: q.question,
                type: 'technical',
            })),
            ...(questions.situational || []).map((q) => ({
                question: q.question,
                type: 'situational',
            })),
        ];


        //Update job with generated questions
        await Job.findByIdAndUpdate(jobId, {
            aiInterviewQuestions : allQuestions,
        });
    
        return res.status(200).json({
            message: 'Interview questions generated successfully',
            jobId,
            questions,
        });
        } catch (error) {
            console.error('interviewQuestionGenerator', error.message);
            return res.status(500).json({ message: 'Server error during question generation' });            
        }
    };


    //------ Get saved interview questions for a job -------------------------------------------------

    export const getInterviewQuestions = async (req, res) => {
        try {
            const { jobId } = req.params;

            const job = await Job.findOne({
                _id: jobId,
                company: req.user.company,
            }).select('title aiInterviewQuestions');

            if(!job) {
                return res.status(404).json({ message: 'Job not found or access denied'});
            }


            return res.status(200).json({ jobTitle: job.title, questions: job.aiInterviewQuestions});
        } catch (error) {
            console.error('getInterviewQuestions Error: ', error.message);
            return res.status(500).json({ message: 'Server Error' });
        }
    }

//---------- Ai Job Description Writer --------------------------------------------------------------------------

export const generateJobDescription = async (req, res) => {
    const groq = getGroqClient();
    try {
        const { title, industry, experienceLevel, additionalContext } = req.body;

        if(!title) {
            return res.status(400).json({ message: 'Job title is required' });
        }

        const prompt = `
        You are an expert HR professional and technical recruiter,
        Write a complete, professional job description for the following role:
        
        Job Title: ${title}
        Industry: ${industry || 'Technology'}
        Experience Level: ${experienceLevel || 'Mid-level'}
        Additional Context: ${additionalContext || 'None'}

        Return ONLY a valid JSON object with exactly this structure, no extra text: 
        {
            "title": "exact job title", 
            "description": "2-3 paragraph engaging company and role overview",
            "requirements": ["requirement 1", "requirement 2", "requirement 3", "requirement 4", "requirement 5"],
            "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
            "suggestJobType": "full-time or remote or contract",
            "suggestedExperienceLevel": "Junior or Mid-level or Senior"
        }
            `;
          
          
            const result = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert HR professional. Always respond with valid JSON only. No markdown, no backticks, no extra text',
                    },
                    {
                        role: 'user',
                        content: prompt, 
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            });
       
            const rawText = result.choices[0].message.content.trim();
            
            //Safely parse JSON from Gemini response
            let parsed;
            try {
                parsed = JSON.parse(rawText);
            } catch (error) {
                // If AI added extra text, extract JSON from it 
                const jsonMatch = rawText.match(/\{[\s\S]*\}/);
             
                if(!jsonMatch) {
                    return res.status(500).json({ message: 'AI returned invalid response, please try again' });
                }
                parsed = JSON.parse(jsonMatch[0]);
            }
            return res.status(200).json({
                message: 'Job description generated successfully',
                generated: parsed,
            });
    } catch (error) {
        console.error('generatedJobDescription error: ' , error.message);
        return res.status(500).json({ message: 'Server error during AI generation' });
    }
};
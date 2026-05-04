import express from 'express';
import { 
    getCandidateProfile,
    updateCandidateProfile,
    uploadResume,
    getResume,
    deleteResume,
    uploadProfileImage,
    getPublicCandidateProfile,
    getCandidateDashboard,
} from '../controllers/candidateController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { handleUpload, profileImageUpload, resumeUpload } from '../middleware/uploadMiddleware.js';
// import { handleUpload, uploadResume, uploadProfileImage } from '../middleware/uploadMiddleware.js';


const router = express.Router();

//---- Candidate profile routes ---------------------------------
router.get('/profile', protect, authorizeRoles('candidate'), getCandidateProfile);
router.put('/profile', protect, authorizeRoles('candidate'), updateCandidateProfile);


//------ Resume routes ------------------------------------------
router.post('/upload-resume', protect, authorizeRoles('candidate'), handleUpload(resumeUpload), uploadResume);
router.get('/resume', protect, authorizeRoles('candidate'), getResume);
router.delete('/resume', protect, authorizeRoles('candidate'), deleteResume);


//--- Profile Image routes (all roles) --------------------------
router.post('/upload-profileImage', protect, handleUpload(profileImageUpload), uploadProfileImage);


//--- Candidate Dashboard ---------------------------------------
router.get('/dashboard', protect, authorizeRoles('candidate'), getCandidateDashboard);

//----- Public profiles (recruiters can view) -------------------
router.get('/:candidateId', protect, authorizeRoles('recruiter'), getPublicCandidateProfile);

export default router;

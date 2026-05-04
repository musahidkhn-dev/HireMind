import express from "express";
import {
  getPlatformStats,
  getAllUsers,
  getAllCompanies,
  blockUser,
  deleteUser,
  deleteCompany,
  getUserDetails,
  getCompanyById,
  getJobById,
  getAllJobs,
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";


const router = express.Router();


// All admin routes - superadmin and legacy super_admin only
router.use(protect, authorizeRoles("superadmin", "super_admin"));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.patch('/block-user/:userId', blockUser);
router.delete('/delete-user/:userId', deleteUser);
router.get('/companies', getAllCompanies);
router.get('/companies/:id', getCompanyById);
router.delete('/delete-company/:companyId', deleteCompany);
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobById);

export default router;

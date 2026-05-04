import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './src/models/jobModel.js';
import User from './src/models/userModel.js';

dotenv.config();

const resetOwnership = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // First, check how many jobs have no createdBy
        const corruptedJobs = await Job.countDocuments({ createdBy: null });
        console.log(`Found ${corruptedJobs} jobs with missing createdBy`);

        if (corruptedJobs > 0) {
            // Find a superadmin or fallback recruiter to assign to prevent validation errors
            const fallbackUser = await User.findOne({ role: { $in: ['superadmin', 'recruiter'] } });
            
            if (fallbackUser) {
                console.log(`Assigning orphaned jobs to fallback user: ${fallbackUser._id}`);
                const result = await Job.updateMany(
                    { createdBy: null },
                    { $set: { createdBy: fallbackUser._id } }
                );
                console.log(`Updated ${result.modifiedCount} jobs successfully.`);
            } else {
                console.log("No valid fallback user found! Cannot reset corrupted jobs.");
            }
        } else {
            console.log("No corrupted jobs found. System is clean.");
        }

        mongoose.disconnect();
    } catch (error) {
        console.error("Error resetting ownership:", error);
        process.exit(1);
    }
};

resetOwnership();

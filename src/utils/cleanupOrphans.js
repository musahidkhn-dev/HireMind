import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/userModel.js';
import Company from '../models/companyModel.js';
import Job from '../models/jobModel.js';

async function cleanup() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully.');

        // 1. Rename 'admin' to 'createdBy' using raw MongoDB update
        console.log('Migrating "admin" field to "createdBy" in companies...');
        const migrateResult = await mongoose.connection.collection('companies').updateMany(
            { admin: { $exists: true }, createdBy: { $exists: false } },
            [
                { $set: { createdBy: "$admin" } }
            ]
        );
        console.log(`Migrated ${migrateResult.modifiedCount} companies.`);

        // 2. Remove 'admin' field from all companies (cleanup)
        await mongoose.connection.collection('companies').updateMany({}, { $unset: { admin: "" } });

        // 3. Find and delete orphaned companies (no createdBy or createdBy user doesn't exist)
        console.log('Cleaning up orphaned companies...');
        const allCompanies = await Company.find();
        let deletedCompanies = 0;
        for (let company of allCompanies) {
            const userExists = await User.exists({ _id: company.createdBy });
            if (!userExists) {
                await Job.deleteMany({ company: company._id });
                await Company.deleteOne({ _id: company._id });
                deletedCompanies++;
            }
        }
        console.log(`Deleted ${deletedCompanies} orphaned companies and their jobs.`);

        // 4. Find and delete orphaned jobs (no createdBy/company or user/company doesn't exist)
        console.log('Cleaning up orphaned jobs...');
        const allJobs = await Job.find();
        let deletedJobs = 0;
        for (let job of allJobs) {
            const userExists = await User.exists({ _id: job.createdBy });
            const companyExists = await Company.exists({ _id: job.company });
            if (!userExists || !companyExists) {
                await Job.deleteOne({ _id: job._id });
                deletedJobs++;
            }
        }
        console.log(`Deleted ${deletedJobs} orphaned jobs.`);

        console.log('Cleanup complete!');
        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
}

cleanup();

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

async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- DB Audit Report ---');

        const companiesWithAdmin = await mongoose.connection.collection('companies').countDocuments({ admin: { $exists: true } });
        console.log(`Companies with "admin" field: ${companiesWithAdmin}`);

        const companiesWithoutCreatedBy = await Company.countDocuments({ createdBy: { $exists: false } });
        console.log(`Companies without "createdBy" field: ${companiesWithoutCreatedBy}`);

        const orphanCompanies = [];
        const allCompanies = await Company.find();
        for (let company of allCompanies) {
            const userExists = await User.exists({ _id: company.createdBy });
            if (!userExists) orphanCompanies.push(company._id);
        }
        console.log(`Orphaned companies (owner doesn't exist): ${orphanCompanies.length}`);

        const orphanJobs = [];
        const allJobs = await Job.find();
        for (let job of allJobs) {
            const userExists = await User.exists({ _id: job.createdBy });
            const companyExists = await Company.exists({ _id: job.company });
            if (!userExists || !companyExists) orphanJobs.push(job._id);
        }
        console.log(`Orphaned jobs (owner/company doesn't exist): ${orphanJobs.length}`);

        console.log('--- End of Report ---');
        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

verify();

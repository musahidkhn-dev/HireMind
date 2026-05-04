import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/userModel.js';

dotenv.config();

const migrateRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for migration...');

    // 1. Convert company_admin to recruiter
    const companyAdminResult = await User.updateMany(
      { role: 'company_admin' },
      { $set: { role: 'recruiter' } }
    );
    console.log(`Updated ${companyAdminResult.modifiedCount} company_admin users to recruiter.`);

    // 2. Convert super_admin to superadmin
    const superAdminResult = await User.updateMany(
      { role: 'super_admin' },
      { $set: { role: 'superadmin' } }
    );
    console.log(`Updated ${superAdminResult.modifiedCount} super_admin users to superadmin.`);

    // 3. Convert any other legacy roles (like employee) to recruiter or candidate
    const employeeResult = await User.updateMany(
      { role: 'employee' },
      { $set: { role: 'recruiter' } }
    );
    console.log(`Updated ${employeeResult.modifiedCount} employee users to recruiter.`);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

migrateRoles();

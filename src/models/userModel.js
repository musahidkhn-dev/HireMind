import mongoose from "mongoose";
import { genSalt, hash, compare } from 'bcryptjs';


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // add this hides password by default
      default: null
    },
    role: {
      type: String,
      enum: ["superadmin", "recruiter", "candidate"],
      required: true,
      default: "candidate",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null, // only for recruiter
    },
    userImage: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    inviteToken: {
      type: String,
      default: null,
    },
    inviteTokenExpiry: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpiry: {
      type: Date,
      default: null,
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpire: {
      type: Date,
      default: null,
    },
    securityQuestion: {
      type: String,
      default: null,
    },
    securityAnswer: {
      type: String,
      default: null,
    },
    isProfileComplete: {
      type: Boolean,
      default: true, // Default to true for legacy/local users
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
    providerId: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    githubId: {
      type: String,
      default: null,
    },
    followingCompanies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// Virtual for CandidateProfile
userSchema.virtual('profile', {
  ref: 'CandidateProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

// Skip hashing if no password (social login)
userSchema.pre("save", async function (){
  if(!this.password) return;
  if(!this.isModified("password") )return;
  

    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
})

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

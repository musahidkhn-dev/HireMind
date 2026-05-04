import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
      default: "1-10",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each recruiter has their own unique company profile
    },
    recruiters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for company team members (admin + recruiters + employees)
companySchema.virtual('team', {
  ref: 'User',
  localField: '_id',
  foreignField: 'company',
});

const Company = mongoose.model("Company", companySchema);

export default Company;

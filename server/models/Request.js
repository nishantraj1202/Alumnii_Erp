const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Personal Information
    name: { type: String, required: true },
    branch: { type: String, enum: ["CSE", "ECE", "EE", "ME", "CE", "BT", "ICE", "IPE", "TT", "CHE"], required: true },
    rollNo: { type: String, required: true },
    mobileNo: { type: String, required: true },
    alternativeNo: { type: String },
    email: { type: String, required: true },
    alternativeEmail: { type: String },
    address: { type: String },
    batchYear: { type: String },
    
    // Placement Information
    placed: { type: Boolean, required: true },
    currentDesignation: { type: String },
    
    placementDetails: {
      companyName: { type: String },
      package: { type: String },
      city: { type: String },
    },
    
    futurePlans: {
      type: String,
      enum: ["Higher Studies", "Off Campus Prep", "Startup"],
    },
    
    higherStudiesDetails: {
      exam: { type: String, enum: ["Foreign Universities", "GATE"] },
      country: { type: String },
      course: { type: String },
      university: { type: String },
    },
    
    // Feedback Information
    opinionAboutNITJ: { type: String },
    proudPoints: { type: String },
    courseRelevance: { type: String },
    facultyRating: { type: String, enum: ["Excellent", "Very Good", "Good", "Average", "Poor"], default: "Good" },
    infrastructureRating: { type: String, enum: ["Excellent", "Very Good", "Good", "Average", "Poor"], default: "Good" },
    libraryRating: { type: String, enum: ["Excellent", "Very Good", "Good", "Average", "Poor"], default: "Good" },
    educationalResourcesRating: { type: String, enum: ["Excellent", "Very Good", "Good", "Average", "Poor"], default: "Good" },
    canteenRating: { type: String, enum: ["Excellent", "Very Good", "Good", "Average", "Poor"], default: "Good" },
    hostelRating: { type: String, enum: ["Excellent", "Very Good", "Good", "Average", "Poor"], default: "Good" },
    grievanceHandlingRating: { type: String, enum: ["Excellent", "Very Good", "Good", "Average", "Poor"], default: "Good" },
    overallRating: { type: String, enum: ["Excellent", "Very Good", "Good", "Average", "Poor"], default: "Good" },
    
    // Request Status
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  institution: String,
  duration: String,
  score: String,
  qualification: String
});

const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  education: [educationSchema],
  experience: String,
  projects: String,
  certificates: String,
  summary: String,
  skills: [String],
  technologies: [String],
  linkedin: String,
  additionalEducation: String
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);

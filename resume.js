const express = require("express");
const { groqAI } = require("../utils/groq"); // Your Groq API handler
const router = express.Router();

router.post("/resume", async (req, res) => {
  try {
    const {
      name,
      school, schoolDuration, schoolPercentage,
      college, collegeDuration, collegePercentage,
      degree, degreeDuration, degreeCGPA,
      projects, certificates
    } = req.body;

    const prompt = `
Based on the user data below, generate **only** a valid JSON object with this structure:
{
  "summary": "2–3 line professional summary using name and education",
  "skills": ["5–7 real-world skills based on education and experience"],
  "technologies": ["4–6 relevant tools/frameworks used"],
  "education": [
    {
      "qualification": "School",
      "institution": "${school}",
      "duration": "${schoolDuration}",
      "score": "${schoolPercentage}%"
    },
    {
      "qualification": "College",
      "institution": "${college}",
      "duration": "${collegeDuration}",
      "score": "${collegePercentage}%"
    },
    {
      "qualification": "${degree}",
      "institution": "",
      "duration": "${degreeDuration}",
      "score": "${degreeCGPA} CGPA"
    }
  ],
  "projects": "${projects || "Not provided"}",
  "certificates": "${certificates || "Not provided"}"
}

Only use data provided above. Do not guess or invent anything. Return **only a valid JSON object**. No comments, no text before or after.
`;

    const response = await groqAI(prompt);

    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    const jsonText = response.substring(jsonStart, jsonEnd + 1);

    const resumeData = JSON.parse(jsonText);
    res.json(resumeData);
  } catch (err) {
    console.error("AI Resume Error:", err.message);
    res.status(500).json({ error: "Failed to generate AI-enhanced resume" });
  }
});

module.exports = router;

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { groqAI } = require("./grok");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/resume", async (req, res) => {
  try {
    const {
      name,
      school, schoolDuration, schoolPercentage,
      college, collegeDuration, collegePercentage,
      degree, degreeDuration, degreeCGPA,
      projects, certificates
    } = req.body;

   const prompt = `
You are a resume assistant. Based on the following candidate info, generate a valid JSON.

Input:
Name: ${name}
School: ${school} (${schoolDuration}) – ${schoolPercentage}%
College: ${college} (${collegeDuration}) – ${collegePercentage}%
Degree: ${degree} (${degreeDuration}) – ${degreeCGPA} CGPA
Projects: ${projects}
Certificates: ${certificates}

Return JSON (only this format, use real values):
{
  "summary": "<2–3 line summary based on candidate's education and projects>",
  "skills": ["Relevant full-stack development skills"],
  "technologies": ["Frameworks/tools they might know"],
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

⚠️ Only return a clean valid JSON object with actual values. No placeholders, no comments.
`;


    const rawResponse = await groqAI(prompt);

    // Debugging: Log full response
    console.log("🔍 Raw Groq Response:\n", rawResponse);

    const jsonStart = rawResponse.indexOf("{");
    const jsonEnd = rawResponse.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("No valid JSON block found");

    const jsonString = rawResponse.substring(jsonStart, jsonEnd + 1);
    const resumeData = JSON.parse(jsonString);

    res.json(resumeData);
  } catch (error) {
    console.error("❌ Server Error:", error.message);
    res.status(500).json({
      error: "Resume generation failed",
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

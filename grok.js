// groq.js
require("dotenv").config(); // ✅ Must be at the very top

const { Groq } = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function groqAI(prompt) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192"
    });

    return completion.choices[0]?.message?.content || "";
  } catch (err) {
    console.error("Groq API Error:", err.message);
    throw new Error("Groq API call failed: " + err.message);
  }
}

module.exports = { groqAI };

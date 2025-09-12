

const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const cors = require("cors");

const app = express();
const upload = multer();
app.use(cors());
app.use(express.json());

require("dotenv").config(); 
const { saveEvent, saveRecord, recentRecords, searchRecords } = require("./models/supabase");

const { GEMINI_API_KEY, GEMINI_URL } = require("./models/gemini");
const authRouter = require('./routes/auth');
// Auth endpoints
app.use('/auth', authRouter);

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const jobDescription = req.body.jobDescription || "";

    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    const systemPrompt = `You are a world-class career coach and professional resume writer. 
Provide concise, actionable feedback on a resume, optionally tailored to a specific job description.
Format strictly in Markdown in field of related jobs suggest jobs he can apply to.:

### Resume Improvements
- suggestions
### Skills to Learn
- skills
### Related Job Titles
- titles`;

    let userQuery = `**Resume Text:**\n${resumeText}`;
    if (jobDescription.trim()) {
      userQuery += `\n\n**Target Job Description:**\n${jobDescription}`;
    } else {
      userQuery += `\n\n**Target Job Description:**\nNot provided. Provide general feedback based on the resume's content.`;
    }

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Gemini Error:", err);
      return res.status(500).json({ error: "Gemini API request failed" });
    }

    const result = await response.json();
    const output =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    // Persist minimal record
    saveRecord({ type: 'analyze', content: output, created_at: new Date().toISOString() });
    res.json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// Basic keyword scoring and ATS-style checks
app.post("/score", upload.single("resume"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const jobDescription = req.body.jobDescription || "";

    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text.toLowerCase();
    const jd = jobDescription.toLowerCase();

    const words = Array.from(new Set(jd.match(/[a-zA-Z]{3,}/g) || []));
    const matched = words.filter((w) => resumeText.includes(w));
    const score = words.length ? Math.round((matched.length / words.length) * 100) : 0;

    const flags = [];
    if (!/experience|work history|employment/.test(resumeText)) flags.push("Missing clear experience section");
    if (!/education|degree|bachelor|master|phd/.test(resumeText)) flags.push("Missing or unclear education section");
    if (!/email|@/.test(resumeText)) flags.push("Missing email contact");
    if (!/skills/.test(resumeText)) flags.push("Missing skills section");

    saveRecord({ type: 'score', content: JSON.stringify({ score, matched, totalKeywords: words.length, flags }), created_at: new Date().toISOString() });
    res.json({ score, matched, totalKeywords: words.length, flags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to score resume" });
  }
});

// Cover letter generation using Gemini
app.post("/cover-letter", upload.single("resume"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const jobDescription = req.body.jobDescription || "";
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    const systemPrompt = `You write concise, targeted cover letters. Keep it under 200 words, professional, specific, and aligned to the job.`;
    const userQuery = `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nWrite a short cover letter tailored to the job.`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Gemini Error:", err);
      return res.status(500).json({ error: "Gemini API request failed" });
    }

    const result = await response.json();
    const output =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    saveRecord({ type: 'cover_letter', content: output, created_at: new Date().toISOString() });
    res.json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

// Rewrite resume bullets using STAR, quantification, action verbs
app.post("/rewrite-bullets", upload.single("resume"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const jobDescription = req.body.jobDescription || "";
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    const systemPrompt = `Rewrite resume bullets using STAR framework, strong action verbs, and quantifiable impact. Keep bullets concise. Output in Markdown with a section per resume area.`;
    const userQuery = `Resume text to improve bullets:\n${resumeText}\n\nTarget JD (optional):\n${jobDescription}`;

    const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) return res.status(500).json({ error: "Gemini API request failed" });
    const result = await response.json();
    const output = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    saveRecord({ type: 'rewrite_bullets', content: output, created_at: new Date().toISOString() });
    res.json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to rewrite bullets" });
  }
});

// Skills gaps and learning roadmap
app.post("/skills-gap", upload.single("resume"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const jobDescription = req.body.jobDescription || "";
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    const systemPrompt = `Identify skills gaps between resume and target JD. Provide prioritized learning roadmap with resources and milestones. Output Markdown.`;
    const userQuery = `Resume:\n${resumeText}\n\nTarget JD:\n${jobDescription}`;
    const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) return res.status(500).json({ error: "Gemini API request failed" });
    const result = await response.json();
    const output = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    saveRecord({ type: 'skills_gap', content: output, created_at: new Date().toISOString() });
    res.json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate skills gap" });
  }
});

// Tailor resume mapping to JD keywords/requirements
app.post("/tailor", upload.single("resume"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const jobDescription = req.body.jobDescription || "";
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    const systemPrompt = `Map resume experience to JD requirements and keywords. Suggest targeted phrasing and sections to emphasize. Output Markdown with a mapping table and recommended edits.`;
    const userQuery = `Resume:\n${resumeText}\n\nJD:\n${jobDescription}`;
    const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) return res.status(500).json({ error: "Gemini API request failed" });
    const result = await response.json();
    const output = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    saveRecord({ type: 'tailor', content: output, created_at: new Date().toISOString() });
    res.json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to tailor resume" });
  }
});

// Interview questions based on resume and JD
app.post("/interview-questions", upload.single("resume"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const jobDescription = req.body.jobDescription || "";
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    const systemPrompt = `Generate behavioral and technical interview questions tailored to resume and JD. Include ideal talking points. Output Markdown.`;
    const userQuery = `Resume:\n${resumeText}\n\nJD:\n${jobDescription}`;
    const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) return res.status(500).json({ error: "Gemini API request failed" });
    const result = await response.json();
    const output = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    saveRecord({ type: 'interview_questions', content: output, created_at: new Date().toISOString() });
    res.json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate interview questions" });
  }
});

// LinkedIn headline and summary suggestions
app.post("/linkedin", upload.single("resume"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const jobDescription = req.body.jobDescription || "";
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    const systemPrompt = `Draft 3 LinkedIn headlines and a concise About summary tailored to the target role. Output Markdown with sections.`;
    const userQuery = `Resume:\n${resumeText}\n\nTarget JD:\n${jobDescription}`;
    const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) return res.status(500).json({ error: "Gemini API request failed" });
    const result = await response.json();
    const output = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    saveRecord({ type: 'linkedin', content: output, created_at: new Date().toISOString() });

// Search & recent endpoints
app.get('/records/recent', async (req, res) => {
  const { type, limit } = req.query;
  const { data, error } = await recentRecords(type, Number(limit) || 20);
  if (error) return res.status(500).json({ error });
  res.json({ data });
});

app.get('/records/search', async (req, res) => {
  const { q, type, limit } = req.query;
  const { data, error } = await searchRecords(q || '', type, Number(limit) || 50);
  if (error) return res.status(500).json({ error });
  res.json({ data });
});
    res.json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate LinkedIn suggestions" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

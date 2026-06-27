import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // OpenRouter key
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "AI Resume Analyzer",
  },
});

function cleanText(text) {
  return String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function extractFirstJsonObject(text) {
  const cleaned = cleanText(text);

  let startIndex = -1;
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") {
      if (depth === 0) startIndex = i;
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0 && startIndex !== -1) {
        return cleaned.slice(startIndex, i + 1);
      }
    }
  }

  throw new Error("AI did not return a complete JSON object");
}

function calculateProfessionalLevel(score, resumeText = "") {
  const text = String(resumeText || "").toLowerCase();

  const hasIntern =
    text.includes("intern") ||
    text.includes("trainee") ||
    text.includes("apprentice");

  const hasExperience =
    text.includes("experience") ||
    text.includes("worked") ||
    text.includes("developer") ||
    text.includes("engineer");

  const hasStrongSignals =
    text.includes("lead") ||
    text.includes("senior") ||
    text.includes("built") ||
    text.includes("managed") ||
    text.includes("led");

  if (score >= 90) {
    return hasStrongSignals ? "Senior Level" : "Advanced Level";
  }

  if (score >= 80) {
    return hasStrongSignals ? "Mid-Senior Level" : "Mid-Level Professional";
  }

  if (score >= 70) {
    return hasExperience ? "Junior Professional" : "Entry Level";
  }

  if (score >= 55) {
    return hasIntern ? "Intern Level" : "Beginner Level";
  }

  return "Needs Improvement";
}

function normalizeAnalysis(data, resumeText = "") {
  const atsScore = Math.max(0, Math.min(100, Number(data.atsScore) || 0));

  return {
    atsScore,
    overallLevel:
      data.overallLevel || calculateProfessionalLevel(atsScore, resumeText),
    roleMatch: data.roleMatch || "",
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
    missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills : [],
    improvedSummary: data.improvedSummary || "",
    jobMatchRoles: Array.isArray(data.jobMatchRoles) ? data.jobMatchRoles : [],
    interviewQuestions: Array.isArray(data.interviewQuestions)
      ? data.interviewQuestions
      : [],
    overallFeedback: data.overallFeedback || "",
    actionPlan: Array.isArray(data.actionPlan) ? data.actionPlan : [],
    atsKeywordsFound: Array.isArray(data.atsKeywordsFound)
      ? data.atsKeywordsFound
      : [],

    atsKeywordsMissing: Array.isArray(data.atsKeywordsMissing)
      ? data.atsKeywordsMissing
      : [],

    recruiterTips: Array.isArray(data.recruiterTips) ? data.recruiterTips : [],

    resumeHighlights: Array.isArray(data.resumeHighlights)
      ? data.resumeHighlights
      : [],

    improvementPriority: Array.isArray(data.improvementPriority)
      ? data.improvementPriority
      : [],
  };
}

function fallbackAnalysis({ resumeText, role }) {
  const score = 60;

  return {
    atsScore: score,
    overallLevel: calculateProfessionalLevel(score, resumeText),
    roleMatch: `Basic resume match for ${role}.`,
    strengths: [
      "Resume was readable and processed successfully.",
      "Basic structure detected.",
    ],
    weaknesses: [
      "Could not generate advanced AI analysis right now.",
      "Add more keywords and measurable achievements.",
    ],
    missingSkills: [
      "Role-specific keywords",
      "Stronger project impact points",
      "More quantified achievements",
    ],
    improvedSummary:
      "Motivated candidate with a growing skill set and interest in building practical, job-ready solutions.",
    jobMatchRoles: [role],
    interviewQuestions: [
      "Tell me about your strongest project.",
      "What technologies do you use most often?",
      "How do you improve a weak resume?",
    ],
    overallFeedback:
      "AI analysis was unavailable, so this is a fallback report. Try again later for a deeper review.",
    actionPlan: [
      "Add measurable achievements.",
      "Include role-specific keywords.",
      "Strengthen project descriptions.",
    ],
    atsKeywordsFound: ["Communication", "Teamwork"],

    atsKeywordsMissing: ["Docker", "CI/CD", "Testing"],

    recruiterTips: [
      "Quantify achievements wherever possible.",
      "Tailor your resume for every application.",
      "Keep technical skills updated.",
    ],

    resumeHighlights: [
      "Clear resume structure.",
      "Relevant educational background.",
    ],

    improvementPriority: [
      "Add measurable achievements.",
      "Improve project descriptions.",
      "Include role-specific keywords.",
    ],
  };
}

export async function analyzeResumeWithAI({ resumeText, role }) {
  const trimmedText = String(resumeText || "").slice(0, 25000);

  const prompt = `
You are a professional ATS resume analyzer.

Analyze this resume for the role: ${role}

Return ONLY valid JSON with exactly these keys:

- atsScore (number 0-100)

- overallLevel (string)

- roleMatch (string)

- strengths (array of 5-8 strings)

- weaknesses (array of 4-6 strings)

- missingSkills (array of 5-10 strings)

- atsKeywordsFound (array of strings)

- atsKeywordsMissing (array of strings)

- recruiterTips (array of 4-6 strings)

- resumeHighlights (array of 4-6 strings)

- improvementPriority (array of 4-6 strings)

- improvedSummary (string)

- jobMatchRoles (array of 5 strings)

- interviewQuestions (array of 8 strings)

- overallFeedback (string)

- actionPlan (array of 6 strings)

Rules:

- Return ONLY valid JSON.

- Do not use markdown.

- Do not wrap JSON inside code blocks.

- Do not explain anything outside JSON.

- ATS score must be realistic.

- Strengths and weaknesses must be based only on the resume.

- Missing skills should match the selected job role.

- ATS keywords must contain important recruiter keywords already present in the resume.

- ATS missing keywords should contain important role-specific keywords not found in the resume.

- Recruiter tips must be practical and actionable.

- Resume highlights should identify the candidate's strongest achievements or sections.

- Improvement priority should list the highest-impact improvements first.

- Improved summary should be ATS-friendly and professional.

- Interview questions should be role-specific and practical.

- Overall feedback should be detailed (around 120-180 words).

- Action plan should be ordered from highest priority to lowest priority.

Resume text:
${trimmedText}
`.trim();

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS resume analyzer. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const text = response?.choices?.[0]?.message?.content || "";

    if (!text) {
      return fallbackAnalysis({ resumeText: trimmedText, role });
    }

    const jsonText = extractFirstJsonObject(text);
    const parsed = JSON.parse(jsonText);

    return normalizeAnalysis(parsed, trimmedText);
  } catch (error) {
    console.error("OPENROUTER ANALYSIS ERROR:", error);

    if (error?.status === 429) {
      throw new Error("Free AI quota limit reached. Please try again later.");
    }

    if (error?.status === 503) {
      throw new Error("AI server is busy right now. Please try again later.");
    }

    return fallbackAnalysis({ resumeText: trimmedText, role });
  }
}

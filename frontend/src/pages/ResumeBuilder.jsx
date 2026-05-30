import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";

const TEMPLATE_GROUPS = [
  { family: "Classic", layout: "classic" },
  { family: "Minimal", layout: "minimal" },
  { family: "ATS", layout: "ats" },
  { family: "Modern", layout: "modern" },
  { family: "Sidebar", layout: "sidebar" },
  { family: "Professional", layout: "professional" },
  { family: "Academic", layout: "academic" },
  { family: "Compact", layout: "compact" },
  { family: "Corporate", layout: "corporate" },
  { family: "Executive", layout: "executive" },
];

const TEMPLATES = TEMPLATE_GROUPS.flatMap((group) =>
  Array.from({ length: 5 }, (_, index) => {
    const n = index + 1;
    return {
      id: `${group.family.toLowerCase()}-${String(n).padStart(2, "0")}`,
      label: `${group.family} ${String(n).padStart(2, "0")}`,
      layout: group.layout,
    };
  }),
);

const LEVEL_OPTIONS = ["Fresher", "Intern", "Junior", "Mid-Level", "Senior"];
const MOBILE_BREAKPOINT = 900;

const DEFAULT_FORM = {
  fullName: "John Doe",
  title: "Frontend Developer",
  email: "john@example.com",
  phone: "+91 9696586596",
  location: "India",
  summary:
    "Frontend developer building clean, responsive and user-friendly web apps with modern JavaScript and React.",
  projects: "AI Resume Analyzer\nSmart Ai\nMERN Auth System",
  linkedin: "linkedin.com",
  github: "github.com",
};

const DEFAULT_AI = {
  fullName: "John Doe",
  role: "React Developer",
  level: "Mid-Level",
  focus: "responsive web applications, API integration, clean UI",
  location: "India",
};

function cleanFileName(value) {
  return String(value || "resume")
    .trim()
    .replace(/[^\w.-]+/g, "_");
}

function uniq(list = []) {
  return [
    ...new Set(list.map((item) => String(item || "").trim()).filter(Boolean)),
  ];
}

function splitLines(text = "") {
  return String(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeExperience(data = {}) {
  return {
    id: makeId(),
    title: data.title || "",
    company: data.company || "",
    period: data.period || "",
    location: data.location || "",
    points: Array.isArray(data.points) ? data.points : [],
    pointInput: "",
  };
}

function makeEducation(data = {}) {
  return {
    id: makeId(),
    degree: data.degree || "",
    institution: data.institution || "",
    period: data.period || "",
    location: data.location || "",
    score: data.score || "",
  };
}

function getProfile(role = "") {
  const value = String(role).toLowerCase();
  const matches = (...keys) => keys.some((key) => value.includes(key));

  if (matches("designer", "ui/ux", "ui ux", "graphic", "product designer")) {
    return {
      title: "UI/UX Designer",
      preferredLayout: "modern",
      skills: [
        "Figma",
        "UI Design",
        "UX Research",
        "Wireframing",
        "Prototyping",
        "Design Systems",
      ],
      projects: [
        "Designed a mobile-first food ordering interface with clean navigation and clear actions.",
        "Created a responsive dashboard layout with reusable components and consistent spacing.",
        "Built wireframes and clickable prototypes for a student-facing web application.",
      ],
      experienceBullets: [
        "Designed clean, user-friendly screens with clear visual hierarchy.",
        "Worked on responsive layouts and interactive prototypes.",
        "Improved usability with structured spacing and consistent components.",
      ],
    };
  }

  if (
    matches(
      "data scientist",
      "data analyst",
      "machine learning",
      "ml",
      "ai engineer",
      "prompt",
      "nlp",
      "data engineer",
    )
  ) {
    return {
      title: "Data & AI Specialist",
      preferredLayout: "academic",
      skills: [
        "Python",
        "Data Analysis",
        "Machine Learning",
        "SQL",
        "Pandas",
        "Model Evaluation",
      ],
      projects: [
        "Built a resume analysis workflow using structured data and AI suggestions.",
        "Created a data dashboard for tracking performance and actionable insights.",
        "Designed a classification model pipeline for practical decision support.",
      ],
      experienceBullets: [
        "Analyzed structured and unstructured data for actionable patterns.",
        "Built AI-powered workflows and report generation logic.",
        "Created clean, reproducible outputs for business and technical teams.",
      ],
    };
  }

  if (
    matches(
      "devops",
      "cloud",
      "aws",
      "azure",
      "google cloud",
      "site reliability",
      "sre",
    )
  ) {
    return {
      title: "DevOps Engineer",
      preferredLayout: "professional",
      skills: ["AWS", "Docker", "CI/CD", "Linux", "Kubernetes", "Monitoring"],
      projects: [
        "Automated deployment flow for a production-ready web app.",
        "Implemented CI/CD pipelines for faster and safer releases.",
        "Built a cloud deployment plan with monitoring and rollback support.",
      ],
      experienceBullets: [
        "Automated deployment and release workflows.",
        "Improved server reliability and monitoring visibility.",
        "Worked with cloud infrastructure and container-based delivery.",
      ],
    };
  }

  if (matches("marketing", "seo", "content", "brand", "social media")) {
    return {
      title: "Digital Marketing Specialist",
      preferredLayout: "corporate",
      skills: [
        "SEO",
        "Content Strategy",
        "Social Media",
        "Analytics",
        "Copywriting",
        "Campaign Planning",
      ],
      projects: [
        "Created a content strategy plan for a product launch campaign.",
        "Built an SEO checklist for improving discoverability and traffic.",
        "Planned a social media calendar to increase engagement and reach.",
      ],
      experienceBullets: [
        "Managed content and campaign execution with consistent branding.",
        "Improved visibility using SEO and social platforms.",
        "Tracked engagement and optimized communication based on results.",
      ],
    };
  }

  if (matches("hr", "human resources", "talent acquisition")) {
    return {
      title: "HR Executive",
      preferredLayout: "executive",
      skills: [
        "Recruitment",
        "Onboarding",
        "Communication",
        "Interview Scheduling",
        "Documentation",
        "MS Excel",
      ],
      projects: [
        "Built a hiring tracker for interview rounds and candidate follow-up.",
        "Designed an onboarding checklist for new joiners.",
        "Created an employee communication workflow for operations.",
      ],
      experienceBullets: [
        "Supported recruitment and interview scheduling processes.",
        "Handled onboarding communication and documentation.",
        "Coordinated with teams to maintain structured hiring flow.",
      ],
    };
  }

  if (
    matches(
      "sales",
      "business development",
      "customer success",
      "relationship manager",
    )
  ) {
    return {
      title: "Business Development Executive",
      preferredLayout: "executive",
      skills: [
        "Lead Generation",
        "Client Communication",
        "Negotiation",
        "CRM",
        "Sales Strategy",
        "Reporting",
      ],
      projects: [
        "Prepared a lead generation tracker for daily outreach.",
        "Designed a sales follow-up process to improve conversions.",
        "Built a client communication plan for retention and growth.",
      ],
      experienceBullets: [
        "Built and maintained client outreach workflows.",
        "Supported sales growth through follow-ups and reporting.",
        "Coordinated with teams to improve conversion and retention.",
      ],
    };
  }

  if (matches("mobile", "android", "ios", "flutter", "react native")) {
    return {
      title: "Mobile App Developer",
      preferredLayout: "classic",
      skills: [
        "Flutter",
        "React Native",
        "UI Design",
        "API Integration",
        "State Management",
        "Responsive Layouts",
      ],
      projects: [
        "Built a mobile-first app interface for smooth user onboarding.",
        "Created reusable UI components for fast app development.",
        "Integrated API-driven data with clean, responsive screens.",
      ],
      experienceBullets: [
        "Developed responsive mobile screens and reusable components.",
        "Integrated APIs and handled interactive user flows.",
        "Focused on performance and clean UI behavior.",
      ],
    };
  }

  if (
    matches(
      "backend",
      "node",
      "express",
      "java",
      "python",
      "php",
      "laravel",
      "spring",
      "full stack",
      "mern",
      "software engineer",
      "developer",
    )
  ) {
    return {
      title: role || "Software Developer",
      preferredLayout: "classic",
      skills: [
        "React",
        "JavaScript",
        "API Integration",
        "Node.js",
        "MongoDB",
        "Responsive Design",
      ],
      projects: [
        "Built a role-based AI resume analyzer with clean UI and export options.",
        "Developed a responsive Smart Canteen web application with order flows.",
        "Created a full-stack admin dashboard with form validation and live updates.",
      ],
      experienceBullets: [
        "Built responsive and reusable UI components with clean state handling.",
        "Integrated APIs and improved user workflow across pages.",
        "Worked on production-ready features with scalable code structure.",
      ],
    };
  }

  return {
    title: role || "Professional",
    preferredLayout: "minimal",
    skills: [
      "Communication",
      "Problem Solving",
      "Teamwork",
      "Documentation",
      "Microsoft Office",
      "Computer Skills",
    ],
    projects: [
      "Built practical academic and portfolio projects with attention to detail.",
      "Created responsive layouts and organized content structure.",
      "Designed clean documents and project presentations.",
    ],
    experienceBullets: [
      "Worked on structured tasks with attention to clarity and quality.",
      "Maintained clean layout and easy-to-read presentation.",
      "Focused on consistent output and reliability.",
    ],
  };
}

function buildAIDraft(ai, currentForm) {
  const profile = getProfile(ai.role);
  const fullName = ai.fullName.trim() || currentForm.fullName || "Your Name";
  const role = ai.role.trim() || profile.title;
  const focus = ai.focus.trim() || "modern web solutions";
  const level = ai.level.trim().toLowerCase();

  const summary = `${fullName} is a ${level} ${role} focused on ${focus}. Experienced in creating clean, practical and job-ready projects with strong attention to usability and structure.`;

  const extraSkills = splitLines(ai.focus)
    .flatMap((chunk) => chunk.split(","))
    .map((item) => item.trim())
    .filter(Boolean);

  const skills = uniq([
    ...profile.skills,
    ...extraSkills,
    "Problem Solving",
    "Communication",
  ]).slice(0, 12);

  const projects = uniq(profile.projects).slice(0, 4);

  const experiences = [
    makeExperience({
      title: role,
      company: "Self Projects",
      period:
        level === "fresher" || level === "intern"
          ? "2024 - Present"
          : "2022 - Present",
      location: ai.location || currentForm.location || "India",
      points: uniq([
        ...profile.experienceBullets,
        `Built projects focused on ${focus}.`,
        "Used clean component structure and responsive layouts.",
      ]).slice(0, 4),
    }),
  ];

  const educations = [
    makeEducation({
      degree:
        level === "fresher" || level === "intern"
          ? "BCA - Computer Applications"
          : "Bachelor's Degree",
      institution: "Your College Name",
      period: "2022 - 2025",
      location: ai.location || currentForm.location || "India",
      score: "CGPA: 8.2/10",
    }),
  ];

  const preferredTemplateLayout = profile.preferredLayout || "classic";

  return {
    form: {
      fullName,
      title: role,
      email:
        currentForm.email ||
        `${fullName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: currentForm.phone || "+91 98765 43210",
      location: ai.location || currentForm.location || "India",
      summary,
      projects: projects.join("\n"),
      linkedin: currentForm.linkedin || "linkedin.com/in/your-profile",
      github: currentForm.github || "github.com/your-profile",
    },
    skills,
    experiences,
    educations,
    preferredTemplateLayout,
  };
}

function SectionTitle({ children }) {
  return <h3 className="rb-section-title">{children}</h3>;
}

function ChipList({ items }) {
  if (!items || items.length === 0) {
    return <p className="rb-muted">No items added yet.</p>;
  }

  return (
    <div className="rb-chip-wrap">
      {items.map((item, index) => (
        <span className="rb-chip" key={`${item}-${index}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

export default function ResumeBuilder() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [skills, setSkills] = useState([
    "React",
    "JavaScript",
    "Tailwind CSS",
    "API Integration",
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [experiences, setExperiences] = useState([
    makeExperience({
      title: "Frontend Developer",
      company: "Your Company / Internship",
      period: "Jan 2024 - Present",
      location: "Ahmedabad",
      points: [
        "Built responsive web UI with clean structure.",
        "Improved user experience with reusable components.",
        "Worked with API integration and form validation.",
      ],
    }),
  ]);
  const [educations, setEducations] = useState([
    makeEducation({
      degree: "BCA - Computer Applications",
      institution: "Your College Name",
      period: "2022 - 2025",
      location: "Gujarat",
      score: "CGPA: 8.2/10",
    }),
  ]);
  const [projectsText, setProjectsText] = useState(DEFAULT_FORM.projects);
  const [ai, setAi] = useState(DEFAULT_AI);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [error, setError] = useState("");
  const [uploadedResumeName, setUploadedResumeName] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [resumeGenerated, setResumeGenerated] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [mobilePreviewStep, setMobilePreviewStep] = useState(1);

  const previewRef = useRef(null);
  const templateStripRef = useRef(null);

  const selectedTemplate =
    TEMPLATES.find((item) => item.id === selectedTemplateId) || TEMPLATES[0];

  const projectList = useMemo(() => splitLines(projectsText), [projectsText]);

  const filledExperiences = useMemo(
    () =>
      experiences.filter(
        (item) =>
          item.title.trim() ||
          item.company.trim() ||
          item.period.trim() ||
          item.location.trim() ||
          item.points.length > 0,
      ),
    [experiences],
  );

  const filledEducations = useMemo(
    () =>
      educations.filter(
        (item) =>
          item.degree.trim() ||
          item.institution.trim() ||
          item.period.trim() ||
          item.location.trim() ||
          item.score.trim(),
      ),
    [educations],
  );

  useEffect(() => {
    const updateMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    updateMobile();

    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  const pdfData = {
    form,
    skills,
    experiences: filledExperiences,
    educations: filledEducations,
    projectsText,
    templateLayout: selectedTemplate.layout,
  };

  const setField = (key, value) => {
    setError("");
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForExport = () => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.title.trim()) return "Professional title is required.";
    if (skills.length === 0) return "Please add at least one skill.";
    if (filledExperiences.length === 0)
      return "Please add at least one experience.";
    if (filledEducations.length === 0)
      return "Please add at least one education entry.";
    return "";
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    setSkills((prev) => uniq([...prev, value]));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((item) => item !== skill));
  };

  const updateExperience = (id, key, value) => {
    setExperiences((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  const updateExperiencePointInput = (id, value) => {
    setExperiences((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pointInput: value } : item,
      ),
    );
  };

  const addExperiencePoint = (id) => {
    const target = experiences.find((item) => item.id === id);
    const value = target?.pointInput?.trim();
    if (!value) return;

    setExperiences((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, points: uniq([...item.points, value]), pointInput: "" }
          : item,
      ),
    );
  };

  const removeExperiencePoint = (id, point) => {
    setExperiences((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, points: item.points.filter((p) => p !== point) }
          : item,
      ),
    );
  };

  const addExperience = () =>
    setExperiences((prev) => [...prev, makeExperience()]);
  const removeExperience = (id) =>
    setExperiences((prev) => prev.filter((item) => item.id !== id));

  const updateEducation = (id, key, value) => {
    setEducations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  const addEducation = () =>
    setEducations((prev) => [...prev, makeEducation()]);
  const removeEducation = (id) =>
    setEducations((prev) => prev.filter((item) => item.id !== id));

  const applyAIDraft = () => {
    const draft = buildAIDraft(ai, form);

    setForm((prev) => ({
      ...prev,
      ...draft.form,
      email: prev.email?.trim() ? prev.email : draft.form.email,
      phone: prev.phone?.trim() ? prev.phone : draft.form.phone,
      linkedin: prev.linkedin?.trim() ? prev.linkedin : draft.form.linkedin,
      github: prev.github?.trim() ? prev.github : draft.form.github,
    }));

    setSkills(draft.skills);
    setProjectsText(draft.form.projects);
    setExperiences(draft.experiences);
    setEducations(draft.educations);

    const nextTemplate =
      TEMPLATES.find((item) => item.id === selectedTemplateId) ||
      TEMPLATES.find((item) => item.layout === draft.preferredTemplateLayout) ||
      TEMPLATES[0];

    setSelectedTemplateId(nextTemplate.id);
    setError("");
  };

  const scrollTemplates = (direction) => {
    templateStripRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  const handleCreateResume = () => {
  try {
    const validationError = validateForExport();
    if (validationError) {
      setError(validationError);
      return;
    }

    applyAIDraft();
    setResumeGenerated(true);
    setError("");

    setTimeout(() => {
      if (isMobile) {
        setMobilePreviewStep(1);
        setShowMobilePreview(true);
      } else {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  } catch (err) {
    console.error(err);
    setError("Failed to create resume.");
  }
};

  const handleDownloadDOCX = async () => {
    try {
      setDownloadingDocx(true);
      const validationError = validateForExport();
      if (validationError) {
        setError(validationError);
        return;
      }

      const docChildren = [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: form.fullName || "Your Name",
              bold: true,
              size: 36,
              color: "111827",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: form.title || "Professional Title",
              size: 22,
              color: "374151",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 180 },
          children: [
            new TextRun({
              text: [form.email, form.phone, form.location]
                .filter(Boolean)
                .join(" | "),
              size: 16,
              color: "6b7280",
            }),
          ],
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 80, after: 60 },
          children: [new TextRun({ text: "Summary", bold: true, size: 24 })],
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: form.summary || "Write a short professional summary here.",
              size: 18,
              color: "374151",
            }),
          ],
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 80, after: 60 },
          children: [new TextRun({ text: "Skills", bold: true, size: 24 })],
        }),
        ...skills.map(
          (skill) =>
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({ text: skill, size: 18, color: "374151" }),
              ],
            }),
        ),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 80, after: 60 },
          children: [new TextRun({ text: "Experience", bold: true, size: 24 })],
        }),
        ...filledExperiences.flatMap((exp) => [
          new Paragraph({
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: `${exp.title || "Role Title"} — ${exp.company || "Company / Internship"}`,
                bold: true,
                size: 20,
                color: "111827",
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: [exp.period, exp.location].filter(Boolean).join(" | "),
                size: 14,
                color: "6b7280",
              }),
            ],
          }),
          ...exp.points.map(
            (point) =>
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [
                  new TextRun({ text: point, size: 18, color: "374151" }),
                ],
              }),
          ),
        ]),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 80, after: 60 },
          children: [new TextRun({ text: "Projects", bold: true, size: 24 })],
        }),
        ...projectList.map(
          (project) =>
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30 },
              children: [
                new TextRun({ text: project, size: 18, color: "374151" }),
              ],
            }),
        ),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 80, after: 60 },
          children: [new TextRun({ text: "Education", bold: true, size: 24 })],
        }),
        ...filledEducations.flatMap((edu) => [
          new Paragraph({
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: `${edu.degree || "Degree"} — ${edu.institution || "Institution"}`,
                bold: true,
                size: 20,
                color: "111827",
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: [edu.period, edu.location, edu.score]
                  .filter(Boolean)
                  .join(" | "),
                size: 14,
                color: "6b7280",
              }),
            ],
          }),
        ]),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 80, after: 60 },
          children: [new TextRun({ text: "Links", bold: true, size: 24 })],
        }),
        form.linkedin
          ? new Paragraph({
              spacing: { after: 20 },
              children: [
                new TextRun({ text: form.linkedin, size: 16, color: "2563eb" }),
              ],
            })
          : new Paragraph(""),
        form.github
          ? new Paragraph({
              spacing: { after: 20 },
              children: [
                new TextRun({ text: form.github, size: 16, color: "2563eb" }),
              ],
            })
          : new Paragraph(""),
      ].filter(Boolean);

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720,
                  right: 720,
                  bottom: 720,
                  left: 720,
                },
              },
            },
            children: docChildren,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${cleanFileName(form.fullName)}-resume.docx`);
      setError("");
    } catch (err) {
      console.error("DOCX ERROR:", err);
      setError("DOCX export failed. Try again.");
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const target = previewRef.current;
      if (!target) return;

      const canvas = await html2canvas(target, {
        scale: 4,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Full page, no visible empty border
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`${form.fullName || "resume"}.pdf`);
    } catch (error) {
      console.error("PDF ERROR:", error);
    }
  };

  const renderHeader = () => (
    <div className="rb-preview-header">
      <div>
        <h1>{form.fullName || "Your Name"}</h1>
        <h2>{form.title || "Professional Title"}</h2>
      </div>

      <div className="rb-contact">
        <p>{form.email || "email@example.com"}</p>
        <p>{form.phone || "+91 XXXXX XXXXX"}</p>
        <p>{form.location || "Your Location"}</p>
      </div>
    </div>
  );

  const renderSummary = () => (
    <section className="rb-section">
      <SectionTitle>Summary</SectionTitle>
      <p className="rb-text">
        {form.summary || "Write a short professional summary here."}
      </p>
    </section>
  );

  const renderSkills = () => (
    <section className="rb-section">
      <SectionTitle>Skills</SectionTitle>
      <ChipList items={skills} />
    </section>
  );

  const renderExperience = () => (
    <section className="rb-section">
      <SectionTitle>Experience</SectionTitle>

      {filledExperiences.length > 0 ? (
        <div className="rb-stack">
          {filledExperiences.map((exp, index) => (
            <article className="rb-item" key={exp.id || index}>
              <div className="rb-item-head">
                <div>
                  <strong>{exp.title || "Role Title"}</strong>
                  <span>{exp.company || "Company / Internship"}</span>
                </div>
                <div className="rb-item-meta">{exp.period || "Duration"}</div>
              </div>

              {exp.location ? (
                <div className="rb-item-location">{exp.location}</div>
              ) : null}

              {exp.points.length > 0 ? (
                <ul className="rb-bullets">
                  {exp.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="rb-muted">Add your experience details.</p>
      )}
    </section>
  );

  const renderProjects = () => (
    <section className="rb-section">
      <SectionTitle>Projects</SectionTitle>
      {projectList.length > 0 ? (
        <ul className="rb-bullets">
          {projectList.map((project) => (
            <li key={project}>{project}</li>
          ))}
        </ul>
      ) : (
        <p className="rb-muted">Add one project per line.</p>
      )}
    </section>
  );

  const renderEducation = () => (
    <section className="rb-section">
      <SectionTitle>Education</SectionTitle>

      {filledEducations.length > 0 ? (
        <div className="rb-stack">
          {filledEducations.map((edu, index) => (
            <article className="rb-item" key={edu.id || index}>
              <div className="rb-item-head">
                <div>
                  <strong>{edu.degree || "Degree"}</strong>
                  <span>{edu.institution || "Institution"}</span>
                </div>
                <div className="rb-item-meta">{edu.period || "Year"}</div>
              </div>

              {(edu.location || edu.score) && (
                <div className="rb-item-location">
                  {[edu.location, edu.score].filter(Boolean).join(" | ")}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="rb-muted">Add your education details.</p>
      )}
    </section>
  );

  const renderLinks = () => (
    <section className="rb-section">
      <SectionTitle>Links</SectionTitle>
      <div className="rb-links">
        {form.linkedin ? (
          <p>{form.linkedin}</p>
        ) : (
          <p className="rb-muted">LinkedIn profile</p>
        )}
        {form.github ? (
          <p>{form.github}</p>
        ) : (
          <p className="rb-muted">GitHub profile</p>
        )}
      </div>
    </section>
  );

  const renderPreviewBody = () => {
    switch (selectedTemplate.layout) {
      case "sidebar":
        return (
          <div className="rb-preview-grid rb-sidebar-layout">
            <aside className="rb-sidebar-col">
              {renderSkills()}
              {renderEducation()}
              {renderLinks()}
            </aside>
            <main className="rb-main-col">
              {renderSummary()}
              {renderExperience()}
              {renderProjects()}
            </main>
          </div>
        );

      case "ats":
      case "minimal":
      case "compact":
        return (
          <div className="rb-stack">
            {renderSummary()}
            {renderSkills()}
            {renderExperience()}
            {renderProjects()}
            {renderEducation()}
            {renderLinks()}
          </div>
        );

      case "academic":
        return (
          <div className="rb-stack">
            {renderSummary()}
            {renderEducation()}
            {renderExperience()}
            {renderProjects()}
            {renderSkills()}
            {renderLinks()}
          </div>
        );

      case "executive":
        return (
          <div className="rb-executive-layout">
            <div className="rb-exec-summary">{renderSummary()}</div>
            <div className="rb-exec-grid">
              <div>{renderExperience()}</div>
              <div>{renderSkills()}</div>
            </div>
            <div className="rb-exec-grid">
              <div>{renderProjects()}</div>
              <div>{renderEducation()}</div>
            </div>
            {renderLinks()}
          </div>
        );

      default:
        return (
          <div className="rb-preview-grid rb-two-col-layout">
            <div className="rb-main-col">
              {renderSummary()}
              {renderExperience()}
              {renderProjects()}
            </div>
            <div className="rb-side-col">
              {renderSkills()}
              {renderEducation()}
              {renderLinks()}
            </div>
          </div>
        );
    }
  };

  return (
    <section
      className="rb-page"
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: "0",
        padding: "24px 0 32px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .rb-page{
          min-height: 100vh;
          width: calc(100% - 48px);
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px 0 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-sizing: border-box;
        }

        .rb-topbar,
        .rb-card,
        .rb-preview-card,
        .rb-editor-shell,
        .rb-editor-card,
        .rb-mobile-modal-card{
          background: rgba(255,255,255,.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(148,163,184,.22);
          box-shadow: 0 18px 50px rgba(59,130,246,.10);
          border-radius: 24px;
        }

        .rb-topbar{
          padding: 26px 28px;
        }

        .rb-topbar h1{
          margin: 8px 0 10px;
          font-size: clamp(24px, 2.6vw, 36px);
          color: #0f172a;
          line-height: 1.1;
        }

        .rb-topbar p,
        .rb-card p,
        .rb-muted,
        .rb-item-meta,
        .rb-item-location,
        .rb-contact p{
          color: #475569;
        }

        .rb-badge{
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(59,130,246,.12);
          color: #2563eb;
          border: 1px solid rgba(59,130,246,.18);
          font-size: 13px;
          font-weight: 700;
        }

        .rb-actions{
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: flex-end;
        }

        .rb-btn{
          border: none;
          border-radius: 16px;
          padding: 12px 18px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .rb-btn-primary{
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          color: white;
          box-shadow: 0 12px 26px rgba(37,99,235,.22);
        }

        .rb-btn-secondary{
          background: rgba(255,255,255,.72);
          color: #1e40af;
          border: 1px solid rgba(59,130,246,.22);
        }

        .rb-btn:hover{
          transform: translateY(-1px);
        }

        .rb-btn:disabled{
          opacity: .65;
          cursor: not-allowed;
          transform: none;
        }

        .rb-error{
          background: rgba(254,242,242,.95);
          color: #b91c1c;
          border: 1px solid rgba(239,68,68,.18);
          border-radius: 16px;
          padding: 12px 16px;
        }

        .rb-grid{
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
          gap: 22px;
          align-items: start;
        }

        .rb-left,
        .rb-right{
          min-width: 0;
        }

        .rb-editor-shell{
          padding: 18px;
        }

        .rb-editor-toolbar{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .rb-editor-toolbar h2,
        .rb-card-head h2,
        .rb-section-title{
          color: #0f172a;
        }

        .rb-editor-scroll{
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rb-card{
          padding: 18px;
        }

        .rb-card-head{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .rb-ai-grid,
        .rb-form-grid{
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .rb-field.rb-full{
          grid-column: 1 / -1;
        }

        .rb-field label{
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        .rb-input,
        .rb-textarea,
        .rb-template-select,
        .rb-page input[type="file"]{
          width: 100%;
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(148,163,184,.32);
          color: #0f172a;
          border-radius: 16px;
          padding: 13px 14px;
          outline: none;
          box-sizing: border-box;
        }

        .rb-textarea{
          min-height: 116px;
          resize: vertical;
        }

        .rb-input:focus,
        .rb-textarea:focus,
        .rb-template-select:focus{
          border-color: rgba(37,99,235,.55);
          box-shadow: 0 0 0 4px rgba(59,130,246,.12);
        }

        .rb-template-carousel-head{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .rb-carousel-actions{
          display: flex;
          gap: 8px;
        }

        .rb-icon-btn{
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(59,130,246,.18);
          background: rgba(255,255,255,.78);
          cursor: pointer;
        }

        .rb-template-strip{
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 6px;
          scroll-behavior: smooth;
        }

        .rb-template-card{
          min-width: 168px;
          max-width: 168px;
          text-align: left;
          padding: 16px;
          border-radius: 20px;
          border: 1px solid rgba(148,163,184,.25);
          background: rgba(255,255,255,.82);
          cursor: pointer;
          transition: .2s ease;
        }

        .rb-template-card.active{
          border-color: rgba(37,99,235,.42);
          box-shadow: 0 14px 28px rgba(37,99,235,.12);
          background: linear-gradient(180deg, rgba(239,246,255,.95), rgba(255,255,255,.92));
        }

        .rb-template-card strong{
          display: block;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .rb-template-card span{
          display: block;
          font-size: 13px;
          color: #64748b;
        }

        .rb-template-card small{
          display: inline-flex;
          margin-top: 12px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(59,130,246,.10);
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
        }

        .rb-inline-add{
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .rb-chip-wrap{
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .rb-chip,
        .rb-template-pill,
        .rb-chip-action{
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(59,130,246,.10);
          color: #2563eb;
          border: 1px solid rgba(59,130,246,.16);
        }

        .rb-chip-action{
          cursor: pointer;
        }

        .rb-link-btn{
          border: none;
          background: transparent;
          color: #2563eb;
          font-weight: 700;
          cursor: pointer;
        }

        .rb-stack{
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .rb-editor-card{
          padding: 16px;
        }

        .rb-bullet-list{
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rb-bullet-row{
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(248,250,252,.92);
          border: 1px solid rgba(226,232,240,.9);
        }

        .rb-preview-card{
          padding: 14px;
        }

        .rb-preview-toolbar{
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(59,130,246,.12), rgba(96,165,250,.08));
          border: 1px solid rgba(59,130,246,.16);
          margin-bottom: 14px;
          color: #1e3a8a;
          font-weight: 700;
        }

        .rb-preview-paper{
          width: 100%;
          max-width: 638px;
          box-sizing: border-box;
          background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
          border: 1px solid rgba(59,130,246,.12);
          box-shadow: 0 20px 40px rgba(15,23,42,.08);
          border-radius: 22px;
          padding: 20px;
        }

        .rb-mobile-modal{
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(15,23,42,.48);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .rb-mobile-modal-card{
          width: min(100%, 760px);
          max-height: 90vh;
          overflow: auto;
          padding: 18px;
        }

        .rb-mobile-modal-head{
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .rb-mobile-modal-head h3{
          margin: 0;
          color: #0f172a;
          font-size: 22px;
        }

        .rb-mobile-modal-actions{
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .rb-mobile-preview-paper{
          padding: 18px;
          border-radius: 20px;
          background: #fff;
          border: 1px solid rgba(59,130,246,.14);
        }

        .rb-two-col-layout{
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          gap: 18px;
        }

        .rb-sidebar-layout{
          display: grid;
          grid-template-columns: .72fr 1.28fr;
          gap: 18px;
        }

        .rb-sidebar-col,
        .rb-main-col{
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .rb-executive-layout{
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .rb-exec-grid{
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .rb-contact p,
        .rb-item-location,
        .rb-item-meta{
          margin: 0;
        }

        @media (max-width: 900px){
          .rb-page{
            width: 100%;
            padding: 16px;
          }

          .rb-topbar{
            flex-direction: column;
            align-items: flex-start;
          }

          .rb-actions{
            width: 100%;
            justify-content: flex-start;
          }

          .rb-grid{
            grid-template-columns: 1fr;
          }

          .rb-right{
            position: absolute;
            left: -99999px;
            top: 0;
            width: 1px;
            height: 1px;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
          }

          .rb-ai-grid,
          .rb-form-grid,
          .rb-two-col-layout,
          .rb-sidebar-layout,
          .rb-exec-grid{
            grid-template-columns: 1fr;
          }

          .rb-inline-add{
            flex-direction: column;
            align-items: stretch;
          }

          .rb-template-card{
            min-width: 150px;
            max-width: 150px;
          }
        }
      `}</style>

      <div
        className="rb-topbar rb-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="rb-badge">Resume Builder</span>
          <h1 style={{ margin: "8px 0 10px", color: "#0f172a" }}>
            Create a clean resume with AI and smart templates
          </h1>
          <p style={{ margin: 0, color: "#475569" }}>
            Choose a template, fill your details, generate the resume, and
            download a real PDF.
          </p>
        </div>

        <div className="rb-actions">
          {!resumeGenerated ? (
            <button
              type="button"
              className="rb-btn rb-btn-primary"
              onClick={handleCreateResume}
            >
              Download DOCX
            </button>
          ) : (
            <>
              {isMobile ? (
                <button
                  type="button"
                  className="rb-btn rb-btn-secondary"
                  onClick={() => {
                    setMobilePreviewStep(1);
                    setShowMobilePreview(true);
                  }}
                >
                  Live Preview
                </button>
              ) : null}

              <button
                type="button"
                className="rb-btn rb-btn-secondary"
                onClick={handleDownloadDOCX}
                disabled={downloadingDocx}
              >
                {downloadingDocx ? "Creating DOCX..." : "Download DOCX"}
              </button>
            </>
          )}
        </div>
      </div>

      {error ? <div className="rb-error">{error}</div> : null}

      <div
        className="rb-grid"
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, .95fr)",
          gap: "22px",
          alignItems: "start",
        }}
      >
        <div className="rb-left">
          <div className="rb-editor-shell rb-card">
            <div className="rb-editor-toolbar">
              <div>
                <h2>Your Details</h2>
                <p>Fill the content and choose the best template.</p>
              </div>

              <div className="rb-editor-controls">
                {/* <button
                  type="button"
                  className="rb-btn rb-btn-secondary"
                  onClick={() => scrollTemplates(-1)}
                >
                  ←
                </button> */}
                {/* <button
                  type="button"
                  className="rb-btn rb-btn-secondary"
                  onClick={() => scrollTemplates(1)}
                >
                  →
                </button> */}
              </div>
            </div>

            <div className="rb-editor-scroll">
              <div className="rb-card rb-ai-card">
                <div className="rb-card-head">
                  <div>
                    <h2>AI Resume Creator</h2>
                    <p>Fill the AI fields and let it build the first draft.</p>
                  </div>
                </div>

                <div className="rb-ai-grid">
                  <div className="rb-field">
                    <label>Full Name</label>
                    <input
                      className="rb-input"
                      value={ai.fullName}
                      onChange={(e) =>
                        setAi((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="Hardik Rana"
                    />
                  </div>

                  <div className="rb-field">
                    <label>Target Role</label>
                    <input
                      className="rb-input"
                      value={ai.role}
                      onChange={(e) =>
                        setAi((prev) => ({ ...prev, role: e.target.value }))
                      }
                      placeholder="React Developer"
                    />
                  </div>

                  <div className="rb-field">
                    <label>Experience Level</label>
                    <select
                      className="rb-input"
                      value={ai.level}
                      onChange={(e) =>
                        setAi((prev) => ({ ...prev, level: e.target.value }))
                      }
                    >
                      {LEVEL_OPTIONS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rb-field">
                    <label>Location</label>
                    <input
                      className="rb-input"
                      value={ai.location}
                      onChange={(e) =>
                        setAi((prev) => ({ ...prev, location: e.target.value }))
                      }
                      placeholder="Ahmedabad, Gujarat"
                    />
                  </div>

                  <div className="rb-field rb-full">
                    <label>Focus / Skills Hint</label>
                    <textarea
                      className="rb-textarea"
                      value={ai.focus}
                      onChange={(e) =>
                        setAi((prev) => ({ ...prev, focus: e.target.value }))
                      }
                      placeholder="responsive web apps, API integration, clean UI"
                    />
                  </div>
                </div>

                <div style={{ marginTop: 18 }}>
                  <div className="rb-template-carousel-head">
                    <div>
                      <h2 style={{ margin: 0 }}>Resume Templates</h2>
                      <p style={{ margin: "6px 0 0" }}>
                        Slide and pick the template you like before generating.
                      </p>
                    </div>

                    <div className="rb-carousel-actions">
                      <button
                        type="button"
                        className="rb-icon-btn"
                        onClick={() => scrollTemplates(-1)}
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        className="rb-icon-btn"
                        onClick={() => scrollTemplates(1)}
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div ref={templateStripRef} className="rb-template-strip">
                    {TEMPLATES.map((template) => {
                      const active = selectedTemplateId === template.id;
                      return (
                        <button
                          key={template.id}
                          type="button"
                          className={`rb-template-card ${active ? "active" : ""}`}
                          onClick={() => setSelectedTemplateId(template.id)}
                        >
                          <strong>{template.label}</strong>
                          <span>{template.layout.toUpperCase()}</span>
                          <small>{active ? "Selected" : "Tap to select"}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    className="rb-btn rb-btn-primary"
                    onClick={handleCreateResume}
                  >
                    Create Resume
                  </button>
                </div>
              </div>

              <div className="rb-card">
                <div className="rb-card-head">
                  <div>
                    <h2>Resume Details</h2>
                    <p>Fill the content you want inside the resume.</p>
                  </div>
                </div>

                <div className="rb-form-grid">
                  <div className="rb-field">
                    <label>Full Name</label>
                    <input
                      className="rb-input"
                      value={form.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                    />
                  </div>

                  <div className="rb-field">
                    <label>Professional Title</label>
                    <input
                      className="rb-input"
                      value={form.title}
                      onChange={(e) => setField("title", e.target.value)}
                    />
                  </div>

                  <div className="rb-field">
                    <label>Email</label>
                    <input
                      className="rb-input"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </div>

                  <div className="rb-field">
                    <label>Phone</label>
                    <input
                      className="rb-input"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                    />
                  </div>

                  <div className="rb-field">
                    <label>Location</label>
                    <input
                      className="rb-input"
                      value={form.location}
                      onChange={(e) => setField("location", e.target.value)}
                    />
                  </div>

                  <div className="rb-field rb-full">
                    <label>Summary</label>
                    <textarea
                      className="rb-textarea"
                      value={form.summary}
                      onChange={(e) => setField("summary", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="rb-card">
                <div className="rb-card-head">
                  <div>
                    <h2>Skills</h2>
                    <p>Add one skill at a time.</p>
                  </div>
                </div>

                <div className="rb-inline-add">
                  <input
                    className="rb-input"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Type a skill and click Add"
                  />
                  <button
                    type="button"
                    className="rb-btn rb-btn-secondary"
                    onClick={addSkill}
                  >
                    Add
                  </button>
                </div>

                <div className="rb-chip-wrap" style={{ marginTop: 14 }}>
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="rb-chip rb-chip-action"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ×
                    </button>
                  ))}
                </div>
              </div>

              <div className="rb-card">
                <div className="rb-card-head">
                  <div>
                    <h2>Experience</h2>
                    <p>Use the title, company, period and bullet points.</p>
                  </div>
                  <button
                    type="button"
                    className="rb-btn rb-btn-secondary"
                    onClick={addExperience}
                  >
                    Add Experience
                  </button>
                </div>

                <div className="rb-stack rb-editor-list">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="rb-editor-card">
                      <div className="rb-card-head">
                        <strong>Experience {index + 1}</strong>
                        <button
                          type="button"
                          className="rb-link-btn"
                          onClick={() => removeExperience(exp.id)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="rb-form-grid">
                        <input
                          className="rb-input"
                          value={exp.title}
                          onChange={(e) =>
                            updateExperience(exp.id, "title", e.target.value)
                          }
                          placeholder="Role / Title"
                        />
                        <input
                          className="rb-input"
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(exp.id, "company", e.target.value)
                          }
                          placeholder="Company / Internship"
                        />
                        <input
                          className="rb-input"
                          value={exp.period}
                          onChange={(e) =>
                            updateExperience(exp.id, "period", e.target.value)
                          }
                          placeholder="Period"
                        />
                        <input
                          className="rb-input"
                          value={exp.location}
                          onChange={(e) =>
                            updateExperience(exp.id, "location", e.target.value)
                          }
                          placeholder="Location"
                        />
                      </div>

                      <div className="rb-inline-add" style={{ marginTop: 14 }}>
                        <input
                          className="rb-input"
                          value={exp.pointInput}
                          onChange={(e) =>
                            updateExperiencePointInput(exp.id, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addExperiencePoint(exp.id);
                            }
                          }}
                          placeholder="Add bullet point and press Add"
                        />
                        <button
                          type="button"
                          className="rb-btn rb-btn-secondary"
                          onClick={() => addExperiencePoint(exp.id)}
                        >
                          Add
                        </button>
                      </div>

                      <div className="rb-bullet-list">
                        {exp.points.length > 0 ? (
                          exp.points.map((point) => (
                            <div key={point} className="rb-bullet-row">
                              <span>{point}</span>
                              <button
                                type="button"
                                className="rb-link-btn"
                                onClick={() =>
                                  removeExperiencePoint(exp.id, point)
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="rb-muted">No bullets added yet.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rb-card">
                <div className="rb-card-head">
                  <div>
                    <h2>Education</h2>
                    <p>Keep degree and institution simple and clear.</p>
                  </div>
                  <button
                    type="button"
                    className="rb-btn rb-btn-secondary"
                    onClick={addEducation}
                  >
                    Add Education
                  </button>
                </div>

                <div className="rb-stack rb-editor-list">
                  {educations.map((edu, index) => (
                    <div key={edu.id} className="rb-editor-card">
                      <div className="rb-card-head">
                        <strong>Education {index + 1}</strong>
                        <button
                          type="button"
                          className="rb-link-btn"
                          onClick={() => removeEducation(edu.id)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="rb-form-grid">
                        <input
                          className="rb-input"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(edu.id, "degree", e.target.value)
                          }
                          placeholder="Degree / Course"
                        />
                        <input
                          className="rb-input"
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducation(
                              edu.id,
                              "institution",
                              e.target.value,
                            )
                          }
                          placeholder="College / University"
                        />
                        <input
                          className="rb-input"
                          value={edu.period}
                          onChange={(e) =>
                            updateEducation(edu.id, "period", e.target.value)
                          }
                          placeholder="Period"
                        />
                        <input
                          className="rb-input"
                          value={edu.location}
                          onChange={(e) =>
                            updateEducation(edu.id, "location", e.target.value)
                          }
                          placeholder="Location"
                        />
                        <input
                          className="rb-input"
                          value={edu.score}
                          onChange={(e) =>
                            updateEducation(edu.id, "score", e.target.value)
                          }
                          placeholder="CGPA / Percentage"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rb-card">
                <div className="rb-card-head">
                  <div>
                    <h2>Projects</h2>
                    <p>Write one project per line.</p>
                  </div>
                </div>

                <textarea
                  className="rb-textarea rb-projects"
                  value={projectsText}
                  onChange={(e) => setProjectsText(e.target.value)}
                  placeholder={"AI Resume Analyzer\nSmart Canteen\nGameHub"}
                />
              </div>

              <div className="rb-card">
                <div className="rb-card-head">
                  <div>
                    <h2>Links</h2>
                    <p>Add public profile links.</p>
                  </div>
                </div>

                <div className="rb-form-grid">
                  <input
                    className="rb-input"
                    value={form.linkedin}
                    onChange={(e) => setField("linkedin", e.target.value)}
                    placeholder="LinkedIn URL"
                  />
                  <input
                    className="rb-input"
                    value={form.github}
                    onChange={(e) => setField("github", e.target.value)}
                    placeholder="GitHub URL"
                  />
                </div>
              </div>

              {/* <div className="rb-card">
                <div className="rb-card-head">
                  <div>
                    <h2>Import Existing Resume</h2>
                    <p>
                      Only the filename is shown here. You can replace the
                      content manually.
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setUploadedResumeName(file ? file.name : "");
                  }}
                />

                {uploadedResumeName ? (
                  <p className="rb-muted" style={{ marginTop: 10 }}>
                    Imported: {uploadedResumeName}
                  </p>
                ) : null}
              </div> */}
            </div>
          </div>
        </div>

        <div className="rb-right">
          <div className="rb-preview-card">
            <div className="rb-preview-toolbar">
              <span>Live Preview</span>
              <span>{selectedTemplate.label}</span>
            </div>

            <div
              className={`rb-preview-paper rb-layout-${selectedTemplate.layout}`}
              ref={previewRef}
              style={{
                width: "794px",
                minHeight: "1123px",
                boxSizing: "border-box",
                background: "#fff",
              }}
            >
              {renderHeader()}
              {renderPreviewBody()}
            </div>

            <div
              style={{
                marginTop: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                className="rb-btn rb-btn-primary"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMobilePreview ? (
        <div
          className="rb-mobile-modal"
          onClick={() => setShowMobilePreview(false)}
        >
          <div
            className="rb-mobile-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rb-mobile-modal-head">
              <div>
                <span className="rb-badge">Your resume is here</span>
                <h3>Mobile Preview</h3>
              </div>

              <button
                type="button"
                className="rb-btn rb-btn-secondary"
                onClick={() => setShowMobilePreview(false)}
              >
                Close
              </button>
            </div>

            {mobilePreviewStep === 1 ? (
              <>
                <div className="rb-mobile-preview-paper">
                  <p
                    style={{ marginTop: 0, color: "#0f172a", fontWeight: 700 }}
                  >
                    Your resume is ready.
                  </p>
                  <p style={{ color: "#475569" }}>
                    Tap Live Preview to view the full resume on mobile.
                  </p>
                </div>

                <div className="rb-mobile-modal-actions">
                  <button
                    type="button"
                    className="rb-btn rb-btn-primary"
                    onClick={() => setMobilePreviewStep(2)}
                  >
                    Live Preview
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="rb-mobile-preview-paper">
                  <div
                    className={`rb-preview-paper rb-layout-${selectedTemplate.layout}`}
                    style={{
                      transform: "scale(.92)",
                      transformOrigin: "top center",
                    }}
                  >
                    {renderHeader()}
                    {renderPreviewBody()}
                  </div>
                </div>

                <div className="rb-mobile-modal-actions">
                  <button
                    type="button"
                    className="rb-btn rb-btn-secondary"
                    onClick={() => setMobilePreviewStep(1)}
                  >
                    Back
                  </button>

                  <PDFDownloadLink
                    document={<ResumePDF data={pdfData} />}
                    fileName={`${form.fullName || "resume"}.pdf`}
                    className="rb-btn rb-btn-primary"
                  >
                    {({ loading }) =>
                      loading ? "Preparing PDF..." : "Download PDF"
                    }
                  </PDFDownloadLink>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";
import fs from "fs/promises";

function normalizeText(text) {
  return String(text || "")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isPdfFile(file) {
  const name = String(file?.originalname || "").toLowerCase();
  const type = String(file?.mimetype || "").toLowerCase();

  return (
    name.endsWith(".pdf") ||
    type === "application/pdf" ||
    type.includes("pdf")
  );
}

function isDocxFile(file) {
  const name = String(file?.originalname || "").toLowerCase();
  const type = String(file?.mimetype || "").toLowerCase();

  return (
    name.endsWith(".docx") ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    type.includes("wordprocessingml")
  );
}

function shouldHideWarning(message) {
  const text = String(message || "");
  return (
    /TT:\s*undefined function/i.test(text) ||
    /undefined function/i.test(text) ||
    /invalid cmap/i.test(text) ||
    /font/i.test(text) && /warning/i.test(text)
  );
}

async function withSuppressedWarnings(fn) {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args) => {
    const message = args.map((arg) => String(arg)).join(" ");
    if (shouldHideWarning(message)) return;
    originalWarn(...args);
  };

  console.error = (...args) => {
    const message = args.map((arg) => String(arg)).join(" ");
    if (shouldHideWarning(message)) return;
    originalError(...args);
  };

  try {
    return await fn();
  } finally {
    console.warn = originalWarn;
    console.error = originalError;
  }
}

async function getFileBuffer(file) {
  if (file?.buffer) return file.buffer;
  if (file?.path) return fs.readFile(file.path);
  throw new Error("Resume file buffer not found");
}

async function extractPdfText(buffer) {
  return withSuppressedWarnings(async () => {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
      isEvalSupported: false,
      stopAtErrors: false,
    });

    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => (typeof item.str === "string" ? item.str : ""))
        .filter(Boolean)
        .join(" ");

      if (pageText.trim()) {
        fullText += pageText + "\n";
      }
    }

    return normalizeText(fullText);
  });
}

async function extractDocxText(buffer) {
  const result = await mammoth.extractRawText({
    buffer,
  });

  return normalizeText(result.value || "");
}

export async function extractResumeText(file) {
  try {
    if (!file) {
      throw new Error("Resume file is required");
    }

    const buffer = await getFileBuffer(file);

    if (isPdfFile(file)) {
      const text = await extractPdfText(buffer);
      return text;
    }

    if (isDocxFile(file)) {
      const text = await extractDocxText(buffer);
      return text;
    }

    const name = String(file?.originalname || "").toLowerCase();

    if (name.endsWith(".pdf")) {
      const text = await extractPdfText(buffer);
      return text;
    }

    if (name.endsWith(".docx")) {
      const text = await extractDocxText(buffer);
      return text;
    }

    throw new Error("Only PDF and DOCX files are supported");
  } catch (error) {
    console.error("PARSE RESUME ERROR:", error);
    throw new Error(error.message || "Failed to parse resume");
  }
}
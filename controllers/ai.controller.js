import { GoogleGenAI } from "@google/genai";
import File from "../models/file.model.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";

dotenv.config();


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SUPPORTED_MIME = {
  ".pdf": "application/pdf",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

const getMimeType = (fileUrl) => {
  const ext = path.extname(fileUrl).toLowerCase();
  return SUPPORTED_MIME[ext] || null;
};

const fetchFileBase64 = async (fileUrl) => {
  try {
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength === 0) throw new Error("File is empty");
    return Buffer.from(buffer).toString("base64");
  } catch (err) {
    throw new Error(`Failed to fetch file: ${err.message}`);
  }
};


export const generateFileSummary = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    const mimeType = getMimeType(file.fileUrl);
    if (!mimeType) return res.status(400).json({ success: false, message: "Unsupported file type" });

    const fileBase64 = await fetchFileBase64(file.fileUrl);

    const contents = [
      { text: "Summarize this document in 2–3 short paragraphs highlighting the main ideas." },
      { inlineData: { mimeType, data: fileBase64 } }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    res.status(200).json({ success: true, summary: response.text });
  } catch (error) {
    console.error("AI Summary Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI summary",
      error: error.message,
    });
  }
};


export const generateFileQuiz = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    const mimeType = getMimeType(file.fileUrl);
    if (!mimeType) return res.status(400).json({ success: false, message: "Unsupported file type" });

    const fileBase64 = await fetchFileBase64(file.fileUrl);

    const contents = [
      {
        text: `
Generate a JSON quiz with 5 multiple-choice questions (MCQs) based on this document.
Format strictly as:
{
  "quiz": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "correct option"
   }
  ]
}
Return only valid JSON — no markdown or extra text.
        `
      },
      { inlineData: { mimeType, data: fileBase64 } }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    let parsedQuiz;
try {

  const cleanText = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  parsedQuiz = JSON.parse(cleanText);
} catch {
  parsedQuiz = { raw: response.text };
}

    res.status(200).json({ success: true, quiz: parsedQuiz });
  } catch (error) {
    console.error("AI Quiz Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI quiz",
      error: error.message,
    });
  }
};
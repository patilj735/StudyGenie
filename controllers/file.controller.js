import File from "../models/file.model.js";
import cloudinary from "../config/cloud.js";


export const uploadFile = async (req, res) => {
  try {
    const { title, description, subject } = req.body;
    const createdBy = req.user._id;

    if (!title || !description || !subject)
      return res.status(400).json({ message: "All fields are required" });

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const newFile = await File.create({
      title,
      description,
      subject,
      fileUrl: req.file.secure_url, // path returned by CloudinaryStorage
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Upload File Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllFiles = async (req, res) => {
  try {
    const files =
      req.user.role === "teacher"
        ? await File.find({ createdBy: req.user._id })
        : await File.find().populate("createdBy", "name email");

    res.status(200).json({ success: true, count: files.length, files });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate("createdBy", "name email");
    if (!file) return res.status(404).json({ message: "File not found" });
    res.status(200).json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
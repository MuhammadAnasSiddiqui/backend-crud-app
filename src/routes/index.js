import express from "express";
import { login, register } from "../controllers/userController.js";
import {
  createPost,
  deletePost,
  fetchPosts,
  getSinglePost,
  updatePost,
} from "../controllers/postController.js";
import verifyToken from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const router = express.Router();
// Auth routes
router.post("/register", register);
router.post("/login", login);

// Post routes
router.get("/get-all-posts", verifyToken, fetchPosts);
router.get("/posts/:id", verifyToken, getSinglePost);
router.post("/create", verifyToken, createPost);
router.put("/update/:id", verifyToken, updatePost);
router.delete("/delete/:id", verifyToken, deletePost);

// file upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("🚀 ~ filePath:", filePath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath);
    console.log("🚀 ~ result:", result);

    // Delete local file
    fs.unlinkSync(filePath);

    // Return the Cloudinary URL
    return res.status(200).json({
      message: "File uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return res
      .status(500)
      .json({ error: "Upload failed", message: error.message });
  }
});

export default router;

import express from "express";
import { login, register } from "../controllers/userController.js";
import {
  createPost,
  deletePost,
  fetchPosts,
  getAllPosts,
  getSinglePost,
  updatePost,
} from "../controllers/postController.js";
import verifyToken from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";
import { cloudinaryUpload } from "../utils/index.js";
import { createChat, getChats } from "../controllers/chatControllers.js";

const router = express.Router();
// Auth routes
router.post("/register", register);
router.post("/login", login);

// Post routes
router.get("/get-all-posts", getAllPosts);
router.get("/my-posts", verifyToken, fetchPosts);
router.get("/posts/:id", verifyToken, getSinglePost);
router.post("/create", verifyToken, upload.single("file"), createPost);
router.put("/update/:id", verifyToken, updatePost);
router.delete("/delete/:id", verifyToken, deletePost);

// chat routes
router.post("/chat", verifyToken, createChat);
router.get("/chats", verifyToken, getChats);

// file upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("🚀 ~ filePath:", filePath);

    // Upload to Cloudinary
    const result = await cloudinaryUpload(filePath);
    console.log("🚀 ~ result:", result);

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

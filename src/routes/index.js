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
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    // No file was uploaded
    return res.status(400).json({ error: "No file uploaded" });
  }

  // File upload successful
  const fileUrl = req.file.path; // URL of the uploaded file in Cloudinary

  // Perform any additional logic or save the file URL to a database

  res.status(200).json({ success: true, fileUrl: fileUrl });
});
export default router;

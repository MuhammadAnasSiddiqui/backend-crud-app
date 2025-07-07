import express from "express";
import { login, register } from "../controllers/userController.js";
import {
  createPost,
  deletePost,
  fetchPosts,
} from "../controllers/postController.js";

const router = express.Router();
// Auth routes
router.post("/register", register);
router.post("/login", login);

// Post routes
router.get("/get-all-posts", fetchPosts);
router.post("/create", createPost);
router.delete("/delete/:id", deletePost);
export default router;

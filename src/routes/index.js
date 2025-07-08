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
export default router;

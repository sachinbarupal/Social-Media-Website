import express from "express";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likeUnlikePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create
router.patch("/createPost", verifyToken, createPost);

// READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:id", verifyToken, getUserPosts);

// Update
router.patch("/:id/likeUnlikePost", verifyToken, likeUnlikePost);
export default router;

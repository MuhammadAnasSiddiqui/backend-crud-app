import Post from "../models/postSchema.js";

const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Required field are missing",
      });
    }

    const post = await Post.create({
      title,
      description,
    });

    res.status(201).json({
      status: true,
      data: post,
      message: "post created",
    });
  } catch (error) {
    console.log("🚀 ~ createPostController ~ error:", error);
    res.status(500).json({
      status: false,
      data: null,
      message: error.message,
    });
  }
};

const fetchPosts = async (req, res) => {
  try {
    const posts = await Post.find({});

    res.status(201).json({
      status: true,
      data: posts,
      message: "Fetch all posts",
    });
  } catch (error) {
    console.log("🚀 ~ fetchPosts ~ error:", error);
    res.status(500).json({
      status: false,
      data: null,
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({ _id: id });
    if (!post) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "post not found",
      });
    }

    const deletePost = await Post.findByIdAndDelete({ _id: id });

    res.status(201).json({
      status: true,
      data: deletePost,
      message: "post deleted",
    });
  } catch (error) {
    console.log("🚀 ~ deletePost ~ error:", error);
    res.status(500).json({
      status: false,
      data: null,
      message: error.message,
    });
  }
};

export { createPost, fetchPosts, deletePost };

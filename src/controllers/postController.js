import Post from "../models/postSchema.js";

const createPost = async (req, res) => {
  console.log("🚀 ~ createPost ~ req:", req.id);
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
      userId: req.id,
    });
    // let user = await User.findOne({ _id: req?.id });
    // if (user) {
    //   user.post.push(post._id);
    //   await user.save();
    // }
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

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // console.log("🚀 ~ updatePost ~ post:", post);
    if (!post) {
      return res.status(404).json({
        status: false,
        data: null,
        message: "post not found",
      });
    }
    const { title, description } = req.body;
    post.title = title || post.title;
    post.description = description || post.description;
    await post.save();

    res.status(201).json({
      status: true,
      message: "post updated successfully",
    });
  } catch (error) {
    console.log("🚀 ~ updatePost ~ error:", error);
    res.status(500).json({
      status: false,
      data: null,
      message: error.message,
    });
  }
};

const fetchPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.id });

    res.status(200).json({
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

const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: false,
        data: null,
        message: "post not found",
      });
    }
    res.status(200).json({
      status: true,
      data: post,
      message: "Post fetched successfully",
    });
  } catch (error) {
    console.log("🚀 ~ getSinglePost ~ error:", error);
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
    console.log("🚀 ~ deletePost ~ post:", post);

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

export { createPost, updatePost, fetchPosts, getSinglePost, deletePost };

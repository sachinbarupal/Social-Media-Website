import Post from "../models/Post.js";
import User from "../models/User.js";

// Create
export const createPost = async (req, res) => {
  try {
    const { userId, picturePath, description } = req.body;
    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      userName: user.userName,
      description: description,
      picturePath: picturePath,
    });

    await newPost.save();
    const post = await Post.find();

    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({
      error: err.message,
    });
  }
};

// READ
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ userId: id });

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

// Update
export const likeUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

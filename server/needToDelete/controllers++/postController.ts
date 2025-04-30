// controllers/postController.js
const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = await Post.create({
      title,
      content,
      userId: req.user.id, // Assuming req.user contains the authenticated user's details
    });

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'name email'); // Populates user data
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure only the owner can delete the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};
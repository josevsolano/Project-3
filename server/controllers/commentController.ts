import { Request, Response } from 'express';
// Ensure the correct path to the Comment model
import Comment from '../models/comments.ts';
import Post from '../models/posts.ts'; // Assuming you have a Post model to validate postId
import User from '../models/user.ts'; // Assuming you have a User model to validate userId

// Create a comment
export const createComment = async (req: Request, res: Response): Promise<void> => {
  const { content, postId, userId } = req.body;

  try {
    const newComment = await Comment.create({
      content,
      postId,
      userId,
    });

    res.status(201).json({ message: 'Comment created successfully!', comment: newComment });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

// Get all comments for a specific post
export const getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).populate('userId', 'name'); // Populating user data
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// Update a comment
export const updateComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });

    if (!updatedComment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    res.status(200).json({ message: 'Comment updated successfully!', comment: updatedComment });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    res.status(200).json({ message: 'Comment deleted successfully!' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};
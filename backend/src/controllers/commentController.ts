import { Request, Response } from "express";
import { Comment, Post } from "../models";

interface CommentRequest {
  postId: string;
  userId: string;
  content: string;
}

// Get comments for a post
export const getPostComments = async (
  req: Request<{ postId: string }>,
  res: Response
) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "username profilePicture")
      .populate({
        path: "threads",
        populate: { path: "userId", select: "username profilePicture" },
      });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

// Get single comment
export const getComment = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("userId", "username profilePicture")
      .populate({
        path: "threads",
        populate: { path: "userId", select: "username profilePicture" },
      });
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
    } else {
      res.json(comment);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching comment", error });
  }
};

// Create comment
export const createComment = async (
  req: Request<{}, {}, CommentRequest>,
  res: Response
) => {
  try {
    const { postId, userId, content } = req.body;
    const comment = new Comment({
      postId,
      userId,
      content,
      threads: [],
    });
    const savedComment = await comment.save();

    // Add comment to post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: savedComment._id },
    });

    const populatedComment = await savedComment.populate(
      "userId",
      "username profilePicture"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Error creating comment", error });
  }
};

// Update comment
export const updateComment = async (
  req: Request<{ id: string }, {}, { content: string }>,
  res: Response
) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    )
      .populate("userId", "username profilePicture")
      .populate({
        path: "threads",
        populate: { path: "userId", select: "username profilePicture" },
      });

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
    } else {
      res.json(comment);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
};

// Delete comment
export const deleteComment = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
    } else {
      // Remove comment from post's comments array
      await Post.findByIdAndUpdate(comment.postId, {
        $pull: { comments: comment._id },
      });

      // Delete the comment and its threads
      await Comment.findByIdAndDelete(req.params.id);
      // TODO: Delete associated threads

      res.json({ message: "Comment deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

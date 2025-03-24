import { Request, Response } from "express";
import {
  generateContent,
  generateContentVariations,
} from "../services/aiContent";
import { User, Post, Comment, Thread } from "../models";

// Generate and create a new post
export const generatePost = async (
  req: Request<{}, {}, { userId: string; topic?: string; tone?: string }>,
  res: Response
) => {
  try {
    const { userId, topic, tone } = req.body;

    // Generate post content
    const content = await generateContent({
      type: "post",
      topic,
      tone,
    });

    // Create new post with generated content
    const post = new Post({
      userId,
      content,
    });

    const savedPost = await post.save();
    const populatedPost = await savedPost.populate({
      path: "userId",
      select: ["username", "profilePicture"],
    });

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error generating post:", error);
    res.status(500).json({ message: "Error generating post", error });
  }
};

// Generate and create a new comment
export const generateComment = async (
  req: Request<{}, {}, { userId: string; postId: string; tone?: string }>,
  res: Response
) => {
  try {
    const { userId, postId, tone } = req.body;

    // Get post content for context
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Generate comment content
    const content = await generateContent({
      type: "comment",
      context: post.content,
      tone,
    });

    // Create new comment with generated content
    const comment = new Comment({
      postId,
      userId,
      content,
    });

    const savedComment = await comment.save();

    // Add comment to post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: savedComment._id },
    });

    const populatedComment = await savedComment.populate({
      path: "userId",
      select: ["username", "profilePicture"],
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error generating comment:", error);
    res.status(500).json({ message: "Error generating comment", error });
  }
};

// Generate and create a new thread reply
export const generateThread = async (
  req: Request<{}, {}, { userId: string; commentId: string; tone?: string }>,
  res: Response
) => {
  try {
    const { userId, commentId, tone } = req.body;

    // Get comment content for context
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // Generate thread content
    const content = await generateContent({
      type: "thread",
      context: comment.content,
      tone,
    });

    // Create new thread with generated content
    const thread = new Thread({
      commentId,
      userId,
      content,
    });

    const savedThread = await thread.save();

    // Add thread to comment's threads array
    await Comment.findByIdAndUpdate(commentId, {
      $push: { threads: savedThread._id },
    });

    const populatedThread = await savedThread.populate({
      path: "userId",
      select: ["username", "profilePicture"],
    });

    res.status(201).json(populatedThread);
  } catch (error) {
    console.error("Error generating thread:", error);
    res.status(500).json({ message: "Error generating thread", error });
  }
};

// Generate content variations without saving
export const generateVariations = async (
  req: Request<
    {},
    {},
    {
      type: "post" | "comment" | "thread";
      context?: string;
      topic?: string;
      tone?: string;
      count?: number;
    }
  >,
  res: Response
) => {
  try {
    const { type, context, topic, tone, count = 3 } = req.body;

    const variations = await generateContentVariations({
      type,
      context,
      topic,
      tone,
      count,
    });

    res.json({ variations });
  } catch (error) {
    console.error("Error generating variations:", error);
    res.status(500).json({ message: "Error generating variations", error });
  }
};

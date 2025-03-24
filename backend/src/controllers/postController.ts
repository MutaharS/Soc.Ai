import { Request, Response } from "express";
import { Post } from "../models";

interface PostRequest {
  userId: string;
  content: string;
}

// Get all posts
export const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username profilePicture")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "username profilePicture" },
      });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Get single post
export const getPost = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "username profilePicture")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "username profilePicture" },
      });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

// Create post
export const createPost = async (
  req: Request<{}, {}, PostRequest>,
  res: Response
) => {
  try {
    const { userId, content } = req.body;
    const post = new Post({
      userId,
      content,
      comments: [],
    });
    const savedPost = await post.save();
    const populatedPost = await savedPost.populate(
      "userId",
      "username profilePicture"
    );
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Update post
export const updatePost = async (
  req: Request<{ id: string }, {}, { content: string }>,
  res: Response
) => {
  try {
    const { content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    )
      .populate("userId", "username profilePicture")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "username profilePicture" },
      });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

// Delete post
export const deletePost = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    } else {
      // TODO: Delete associated comments and threads
      res.json({ message: "Post deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

import { Request, Response } from "express";
import { Thread, Comment } from "../models";

interface ThreadRequest {
  commentId: string;
  userId: string;
  content: string;
}

// Get threads for a comment
export const getCommentThreads = async (
  req: Request<{ commentId: string }>,
  res: Response
) => {
  try {
    const threads = await Thread.find({
      commentId: req.params.commentId,
    }).populate("userId", "username profilePicture");
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching threads", error });
  }
};

// Get single thread
export const getThread = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const thread = await Thread.findById(req.params.id).populate(
      "userId",
      "username profilePicture"
    );
    if (!thread) {
      res.status(404).json({ message: "Thread not found" });
    } else {
      res.json(thread);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching thread", error });
  }
};

// Create thread
export const createThread = async (
  req: Request<{}, {}, ThreadRequest>,
  res: Response
) => {
  try {
    const { commentId, userId, content } = req.body;
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

    const populatedThread = await savedThread.populate(
      "userId",
      "username profilePicture"
    );

    res.status(201).json(populatedThread);
  } catch (error) {
    res.status(500).json({ message: "Error creating thread", error });
  }
};

// Update thread
export const updateThread = async (
  req: Request<{ id: string }, {}, { content: string }>,
  res: Response
) => {
  try {
    const { content } = req.body;
    const thread = await Thread.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    ).populate("userId", "username profilePicture");

    if (!thread) {
      res.status(404).json({ message: "Thread not found" });
    } else {
      res.json(thread);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating thread", error });
  }
};

// Delete thread
export const deleteThread = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      res.status(404).json({ message: "Thread not found" });
    } else {
      // Remove thread from comment's threads array
      await Comment.findByIdAndUpdate(thread.commentId, {
        $pull: { threads: thread._id },
      });

      // Delete the thread
      await Thread.findByIdAndDelete(req.params.id);
      res.json({ message: "Thread deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting thread", error });
  }
};

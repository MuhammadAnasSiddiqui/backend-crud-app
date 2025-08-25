import { ChatMessage } from "../models/messageModel.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const senderId = req.id;

    if (!receiverId || !text) {
      return res.status(400).json({
        success: false,
        message: "Receiver id and text message are required",
      });
    }

    const msg = await ChatMessage.create({
      senderId,
      receiverId,
      text,
    });

    return res.status(201).json({
      status: true,
      data: msg,
      message: "Chat created successfully",
    });
  } catch (error) {
    console.log("🚀 ~ sendMessage ~ error:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

export const getUserMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, receiverId } = req.query;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Sender id is required",
      });
    }

    const filter = {
      $or: [
        { senderId: req.id, receiverId: receiverId },
        { senderId: receiverId, receiverId: req.id },
      ],
    };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const totalDocs = await ChatMessage.countDocuments(filter);

    const msgs = await ChatMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      status: true,
      data: msgs,
      page: Number(page),
      limit: Number(limit),
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      message: "User messages fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "userId is required",
      });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ senderId: objectUserId }, { receiverId: objectUserId }],
        },
      },
      {
        $addFields: {
          chatUser: {
            $cond: [
              { $eq: ["$senderId", objectUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$chatUser",
          lastMessage: { $first: "$text" },
          timestamp: { $first: "$createdAt" },
        },
      },
      { $sort: { timestamp: -1 } },
    ]);

    return res.status(200).json({
      status: true,
      totalConversations: conversations.length,
      data: conversations,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

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
    const objectUserId = new mongoose.Types.ObjectId(req.id);

    const conversations = await ChatMessage.aggregate([
      // 1) messages where current user is sender OR receiver
      {
        $match: {
          $or: [{ senderId: objectUserId }, { receiverId: objectUserId }],
        },
      },

      // 2) compute "chatUser" = the other user's ObjectId for each message
      {
        $addFields: {
          chatUser: {
            $cond: [
              { $eq: ["$senderId", objectUserId] }, // if current user sent it
              "$receiverId", // other is receiver
              "$senderId", // otherwise other is sender
            ],
          },
        },
      },

      // 3) newest message first so $first in group picks the latest
      { $sort: { createdAt: -1 } },

      // 4) group by the other user and pick the first (latest) text + timestamp
      {
        $group: {
          _id: "$chatUser", // group key = other user's id
          lastMessage: { $first: "$text" }, // text of the latest message in this conversation
          timestamp: { $first: "$createdAt" }, // timestamp of that message
        },
      },

      // 5) lookup user details (join users collection on _id)
      {
        $lookup: {
          from: "users", // your users collection name
          localField: "_id", // _id is the chatUser from grouping
          foreignField: "_id",
          as: "otherUser",
        },
      },

      // 6) unwind so otherUser becomes an object (preserveNull if you want)
      { $unwind: { path: "$otherUser", preserveNullAndEmptyArrays: true } },

      // 7) shape the final output
      {
        $project: {
          _id: 1, // the other user's id (chat partner)
          lastMessage: 1,
          timestamp: 1,
          otherUser: {
            _id: "$otherUser._id",
            name: "$otherUser.name",
          },
        },
      },

      // 8) (optional) sort conversations by newest message
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

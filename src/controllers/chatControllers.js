import { ChatMessage } from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { senderId, text } = req.body;

    if (!senderId || !text) {
      return res.status(400).json({
        success: false,
        message: "Sender id and text message are required",
      });
    }

    const msg = await ChatMessage.create({
      senderId,
      receiverId: req.id,
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
    const { page = 1, limit = 10, senderId } = req.query;

    if (!senderId) {
      return res.status(400).json({
        status: false,
        message: "sender id are required",
      });
    }
    const totalDocs = await ChatMessage.countDocuments({
      $or: [
        { senderId, receiver: req.id },
        { receiver: senderId, sender: req.id },
      ],
    });
    const skip = (page - 1) * limit;

    const msgs = await ChatMessage.find({
      $or: [
        { senderId, receiver: req.id },
        { receiver: senderId, sender: req.id },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

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
    const { page = 1, limit = 10, userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "userId is required",
      });
    }

    const skip = (page - 1) * limit;

    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        // Normalize conversation between two users
        $addFields: {
          chatUser: {
            $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"],
          },
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort by latest message
      },
      {
        $group: {
          _id: "$chatUser", // Group by other user
          lastMessage: { $first: "$text" },
          timestamp: { $first: "$createdAt" },
        },
      },
      {
        $sort: { timestamp: -1 }, // Sort conversations by latest message
      },
      {
        $facet: {
          metadata: [
            { $count: "totalDocs" },
            {
              $addFields: {
                page: Number(page),
                limit: Number(limit),
                totalPages: {
                  $ceil: { $divide: ["$totalDocs", Number(limit)] },
                },
              },
            },
          ],
          data: [{ $skip: skip }, { $limit: Number(limit) }],
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      ...(conversations[0]?.metadata[0] || {
        page: Number(page),
        limit: Number(limit),
        totalDocs: 0,
        totalPages: 0,
      }),
      data: conversations[0]?.data || [],
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

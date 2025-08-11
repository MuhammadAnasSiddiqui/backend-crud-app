import Chat from "../models/chatModel.js";

export const createChat = async (req, res) => {
  try {
    const { message, receiverId } = req.body;
    const senderId = req.id; // Assuming user ID is stored in req.user after verification

    if (!message || !receiverId) {
      return res
        .status(400)
        .json({ error: "Message and receiverId are required" });
    }

    const chat = await Chat.create({
      message,
      senderId,
      receiverId,
    });

    return res.status(201).json({
      status: true,
      data: chat,
      message: "Chat created successfully",
    });
  } catch (error) {
    console.error("Error in createChat:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

 export const getChats = async (req, res) => {
  try {
    const userId = req.id; // Assuming user ID is stored in req.user after verification
    const chats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).populate("senderId receiverId");

    return res.status(200).json({
      status: true,
      data: chats,
      message: "Chats retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getChats:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

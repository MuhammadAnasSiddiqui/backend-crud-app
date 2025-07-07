import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 ~ connectDb ~ connected Db:");
  } catch (error) {
    console.log("🚀 ~ connectDb ~ error:", error);
  }
};

export default connectDb;

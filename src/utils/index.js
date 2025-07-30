import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const cloudinaryUpload = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required for upload");
    }
    const result = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

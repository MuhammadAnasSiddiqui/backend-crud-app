import express from "express";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import router from "./src/routes/index.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import { v2 as cloudinary } from "cloudinary";

const app = express();
const PORT = process.env.PORT || 3002;
dotenv.config();
connectDb();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.use(errorHandler);

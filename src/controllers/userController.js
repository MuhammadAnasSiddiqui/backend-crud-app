import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Required field are missing",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "user already register",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      password: passwordHash,
      email,
    });
    console.log("🚀 ~ register ~ user:", user);
    res.status(201).json({
      status: true,
      data: user,
      message: "user created",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: null,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Required field are missing",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: false,
        data: null,
        message: "user not found",
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    // console.log("🚀 ~ login ~ comparePassword:", comparePassword);
    if (!comparePassword) {
      return res.status(401).json({
        status: false,
        data: null,
        message: "invalid credential",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    res.status(201).json({
      status: true,
      data: user,
      token,
      message: "login user",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: null,
      message: error.message,
    });
  }
};

export { register, login };

import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    // console.log("🚀 ~ verifyToken ~ req:", req.headers["authorization"]);
    if (req.headers["authorization"]);
    const token = req.headers["authorization"].split(" ");
    console.log("🚀 ~ verifyToken ~ token:", token[1]);

    const verify = jwt.verify(token[1], process.env.SECRET_KEY);
    //   console.log("🚀 ~ verifyToken ~ verify:", verify.id);
    if (verify) {
      next();
    } else {
      res.json({
        status: false,
        message: "Unauthorized user",
      });
    }
  } catch (err) {
    res.json({
      status: false,
      message: "Unauthorized user",
    });
  }
};

export default verifyToken;

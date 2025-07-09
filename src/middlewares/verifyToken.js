import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    if (req.headers["authorization"]);
    const token = req.headers["authorization"].split(" ");

    const verify = jwt.verify(token[1], process.env.SECRET_KEY);
    // console.log("🚀 ~ verifyToken ~ verify:", verify);
    if (verify) {
      req.id = verify?.id;
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

const errorHandler = (err, req, res, next) => {
  console.log("🚀 ~ errorHandler ~ err:", err)
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
};

export default errorHandler;

const jwt = require("jsonwebtoken");
const { logger } = require("../../config/logger");
const config = require("config");
const server = config.get("server");
const auth = config.get("auth");

const User = require("../models/User");

module.exports.confirmEmail = async (req, res) => {
  const decoded = jwt.verify(req.params.emailToken, auth.JWT_SECRET);
  if (!decoded) {
    return res.status(401).json({ msg: "User not verified, integrity lost" });
  }
  try {
    await User.updateOne(
      { _id: decoded.user.id },
      { $set: { isVerified: true } }
    );
    logger.info("Email verified sucessfully");
    return res.redirect(`${server.BASE_FRONT_URL}/login`);
  } catch (err) {
    logger.error(err);
    return res.status(401).json({ msg: "User not verified" });
  }
  //res.send("User Registered Successfully, Please verify your email to login");
};

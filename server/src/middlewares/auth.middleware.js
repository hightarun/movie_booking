const jwt = require("jsonwebtoken");
const config = require("config");
const authConfig = config.get("auth");

module.exports.auth = (req, res, next) => {
  // get token from header
  const token = req.header("auth-token");
  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "Not Authorized" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, authConfig.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Not Authorized" });
  }
};

module.exports.adminAuth = (req, res, next) => {
  // get token from header
  const token = req.header("auth-token");
  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "Not Authorized" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, authConfig.JWT_ADMIN_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Not Authorized" });
  }
};

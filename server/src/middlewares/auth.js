const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // get token from header
  const token = req.header("auth-token");
  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "Not Authorized" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Not Authorized" });
  }
};

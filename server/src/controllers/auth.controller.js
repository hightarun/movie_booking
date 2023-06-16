const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const auth = config.get("auth");
const { logger } = require("../../config/logger");
const jwt = require("jsonwebtoken");

module.exports.getLogin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -email -phone"
    );
    res.json(user);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

// login and send token
module.exports.loginUser = async (req, res) => {
  const { emailOrUname, password } = req.body;
  try {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      String(emailOrUname).toLowerCase()
    );
    let user;
    if (regexEmail) {
      user = await User.findOne({ email: emailOrUname });
    } else {
      user = await User.findOne({ username: emailOrUname });
    }
    if (user.role !== "USER") {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    //check if user confirmed email
    if (!user.isVerified) {
      return res.status(400).json({
        errors: [{ msg: "Please verify your email before loging in" }],
      });
    }

    //matching the password with hashed password in user database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    //user id as payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    //jwt signing the user id and sending the token as json
    jwt.sign(payload, auth.JWT_SECRET, { expiresIn: 86400 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports.loginAdmin = async (req, res) => {
  const { emailOrUname, password } = req.body;
  try {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      String(emailOrUname).toLowerCase()
    );
    let user;
    if (regexEmail) {
      user = await User.findOne({ email: emailOrUname });
    } else {
      user = await User.findOne({ username: emailOrUname });
    }

    if (user.role !== "ADMIN") {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    //check if user confirmed email
    if (!user.isVerified) {
      return res.status(400).json({
        errors: [{ msg: "Please verify your email before loging in" }],
      });
    }

    //matching the password with hashed password in user database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    //user id as payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    //jwt signing the user id and sending the token as json
    jwt.sign(
      payload,
      auth.JWT_ADMIN_SECRET,
      { expiresIn: 86400 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const config = require("config");
const server = config.get("server");
const auth = config.get("auth");
const transporter = require("../utils/emailService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const inValidUsernames = require("../utils/inValidUsernames");
const { logger } = require("../../config/logger");

// Registering new USER
module.exports.addNewUser = async (req, res) => {
  const { username, firstName, lastName, email, password, phone } = req.body;
  try {
    //checking if username is valid
    const regex = /^[a-z_]+([._]?[a-zA-Z0-9]+)*$/;
    if (!username.match(regex)) {
      return res.status(400).json({ errors: [{ msg: "Invalid username" }] });
    }

    //checking if username already exists
    let u = await User.findOne({ username: username });
    if (u) {
      return res
        .status(409)
        .json({ errors: [{ msg: "Username already exists" }] });
    }

    Array.prototype.contains = function (obj) {
      return this.indexOf(obj) > -1;
    };

    //explicit username
    if (inValidUsernames().contains(username)) {
      return res.status(400).json({ errors: [{ msg: "Invalid username" }] });
    }

    //checking if email already exists
    let e = await User.findOne({ email: email });
    if (e) {
      return res
        .status(409)
        .json({ errors: [{ msg: "E-mail already exists" }] });
    }

    let user = new User({
      name: firstName + " " + lastName,
      username: username,
      email: email,
      password: password,
      phone: phone,
    });

    //Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    if (process.env.NODE_ENV == "test") {
      user.isVerified = true;
      await user.save();
      return res
        .status(200)
        .send(
          "User Registered Successfully, Please verify your email to login"
        );
    } else {
      //user id as payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      //jwt signing the user id and sending token for email verification
      jwt.sign(payload, auth.JWT_SECRET, { expiresIn: 86400 }, (err, token) => {
        if (err) throw err;

        //send confirmation email
        const confirmationUrl = `${server.BASE_URL}/api/moviebooking/confirmation/${token}`;
        let mailOptions = {
          from: `"Cinema" <${auth.EMAIL_ID}>`,
          to: email,
          subject: "Email Verification for Cinema",
          text: `Hi ${username}, please confirm your email
                 by clicking on the link.`,
          html: `<h2>Hi, ${username}</h2>
                 <br/>
                 <p>Thank you for registering</p>
                 <br/>
                 <p>Please click here to verify your Email</p>
                 <h1><a href="${confirmationUrl}" target="_blank">here</a></h1>
                 `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            logger.error(error);
            return res
              .status(400)
              .json({ errors: [{ msg: "Cofirmation Email not send" }] });
          }
          res
            .status(200)
            .send(
              "User Registered Successfully, Please verify your email to login"
            );
        });
      });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get info about user
module.exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -email -phone"
    );
    if (!user) {
      return res.send("No User Found");
    }
    return res.send(user);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

// forgot password
module.exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.send("No User Found");
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    user.passwordResetCode = resetCode;
    user.save();

    let mailOptions = {
      from: `"Cinema" <${auth.EMAIL_ID}>`,
      to: user.email,
      subject: "Password Reset request for Cinema",
      text: `Hi ${user.username}.`,
      html: `<h2>Hi, ${user.username}</h2>
               <br/>
               <p>Your Reset code </p>
               <br/>
               <p>Please use the below reset code to change your password</p>
               <h1>${resetCode}</h1>
               `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(error);
        return res
          .status(400)
          .json({ errors: [{ msg: "Reset code not sent to email" }] });
      }
    });
    return res
      .status(200)
      .send("Reset code has been sent to the registered email");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.resetPassword = async (req, res) => {
  const { username, resetCode, newPassword } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.send("No User Found");
    }
    if (user.passwordResetCode == resetCode) {
      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      user.passwordResetCode = null;
      logger.info("Password reset successfull");
      res.status(200).send("Password reset sucessfully");
    } else {
      logger.info("Password reset unsuccessfull");
      return res.status(401).send("Invalid reset code");
    }
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.changePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.send("No user found by this username");
    }
    //matching the password with hashed password in user database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    //Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    logger.info("Password changed successfull");
    return res.status(200).send("Password changed sucessfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

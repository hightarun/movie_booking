const express = require("express");
const router = express.Router();

const app = express();

//helmet for security
const helmet = require("helmet");
app.use(helmet());

const auth = require("../middlewares/auth");
const validation = require("../middlewares/validation");

const { checkLogin } = require("../utils/validationChecks");
const { checkRegister } = require("../utils/validationChecks");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// @route POST /api/moviebooking - SignUp user
router.post(
  "/register",
  checkRegister(),
  validation,
  userController.postSignup
);

// @route GET /api/moviebooking
router.get("/", userController.getSignup);

// @route Get User data
router.get("/:username", userController.getUser);

//@route GET /api/moviebooking
router.get("/", auth, authController.getLogin);

// @route POST /api/moviebooking
router.post("/login", checkLogin(), validation, authController.postLogin);

// @route GET forget password
router.get("/:username/forgot", userController.forgotPassword);
// @route POST reset password
router.post("/reset", userController.resetPassword);
module.exports = router;

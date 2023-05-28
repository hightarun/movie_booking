const express = require("express");
const router = express.Router();

const app = express();

//helmet for security
const helmet = require("helmet");
app.use(helmet());

const confirmationController = require("../controllers/confirmationController");

//@route GET /api/confirmation
router.get("/:emailToken", confirmationController.confirmEmail);

module.exports = router;

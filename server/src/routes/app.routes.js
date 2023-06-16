const express = require("express");
const router = express.Router();
const app = express();
//helmet for security
const helmet = require("helmet");
app.use(helmet());

const { auth, adminAuth } = require("../middlewares/auth.middleware");
const validation = require("../middlewares/validation.middleware");

const { checkLogin } = require("../utils/validationChecks");
const { checkRegister } = require("../utils/validationChecks");

const {
  addNewUser,
  getUserDetails,
  forgotPassword,
  resetPassword,
} = require("../controllers/user.controller");
const {
  loginUser,
  loginAdmin,
  getLogin,
} = require("../controllers/auth.controller");
const { confirmEmail } = require("../controllers/confirmation.controller");
const {
  getAllMovies,
  addNewMovie,
  bookTicket,
  updateTicket,
  deleteTicket,
  updateMovie,
  deleteMovie,
} = require("../controllers/movie.controller");

const {
  getAllTheatres,
  addNewTheatre,
  updateTheatre,
  deleteTheatre,
} = require("../controllers/theatre.controller");

// Authentication Routes
router.post("/register", checkRegister(), validation, addNewUser);
router.get("/:username", getUserDetails);
router.get("/", auth, getLogin);
router.get("/confirmation/:emailToken", confirmEmail);
router.post("/login", checkLogin(), validation, loginUser);
router.post("/admin", checkLogin(), validation, loginAdmin);
router.get("/:username/forgot", forgotPassword);
router.post("/reset", resetPassword);

// Movie Routes
router.get("/movie/all", getAllMovies);
router.post("/:moviename/add", auth, bookTicket);
router.put("/:moviename/update/:ticket", auth, updateTicket);
router.delete("/:moviename/delete/:ticket", auth, deleteTicket);

// ADMIN Routes
router.get("/admin/all-theatre", adminAuth, getAllTheatres);
router.post("/admin/add-movie", adminAuth, addNewMovie);
router.put("/admin/update-movie/:moviename", adminAuth, updateMovie);
router.delete("/admin/delete-movie/:moviename", adminAuth, deleteMovie);
router.post("/admin/add-theatre", adminAuth, addNewTheatre);
router.put("/admin/update-theatre/:theatre", adminAuth, updateTheatre);
router.delete("/admin/delete-theatre/:theatre", adminAuth, deleteTheatre);

//If the path is not found then
router.all("/*", async (req, res) => {
  return res.status(404).json({ message: "Invalid Path" });
});

module.exports = router;
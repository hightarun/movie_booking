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
  changePassword,
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
  updateMovie,
  deleteMovie,
  addShow,
  updateShow,
  deleteShow,
  searchMovie,
} = require("../controllers/movie.controller");

const {
  getAllTheatres,
  addNewTheatre,
  updateTheatre,
  deleteTheatre,
} = require("../controllers/theatre.controller");
const {
  bookTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticket.controller");

// Authentication Routes
router.post("/register", checkRegister(), validation, addNewUser);
router.get("/:username", getUserDetails);
router.get("/", auth, getLogin);
router.get("/confirmation/:emailToken", confirmEmail);
router.post("/login", checkLogin(), validation, loginUser);
router.post("/admin", checkLogin(), validation, loginAdmin);
router.get("/:username/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.post("/change-password", changePassword);

// Movie Ticket Routes
router.get("/movie/all", getAllMovies);
router.post("/movie/add", auth, bookTicket);
router.get("/movie/search/:query", searchMovie);
router.put("/movie/update/:ticketID", auth, updateTicket);
router.delete("/movie/delete/:ticketID", auth, deleteTicket);

// ADMIN Routes
router.get("/admin/all-theatre", adminAuth, getAllTheatres);
router.post("/admin/add-movie", adminAuth, addNewMovie);
router.put("/admin/update-movie/:moviename", adminAuth, updateMovie);
router.delete("/admin/delete-movie/:moviename", adminAuth, deleteMovie);
router.post("/admin/add-theatre", adminAuth, addNewTheatre);
router.put("/admin/update-theatre/:theatre", adminAuth, updateTheatre);
router.delete("/admin/delete-theatre/:theatre", adminAuth, deleteTheatre);
router.post("/admin/add-show", adminAuth, addShow);
router.put("/admin/update-show/:showID", adminAuth, updateShow);
router.delete("/admin/delete-show/:showID", adminAuth, deleteShow);

//If the path is not found then
router.all("/*", async (req, res) => {
  return res.status(404).json({ message: "Invalid Path" });
});

module.exports = router;

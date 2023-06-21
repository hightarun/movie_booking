const config = require("config");
const server = config.get("server");
const auth = config.get("auth");
const User = require("../models/User");
const Movie = require("../models/Movie");
const { logger } = require("../../config/logger");

module.exports.bookTicket = async (req, res) => {
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

module.exports.updateTicket = async (req, res) => {
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

module.exports.deleteTicket = async (req, res) => {
  try {
    let movie = await Movie.findOne({
      movieName: req.params.moviename,
    });
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    return res.status(200).send("Movie deleted successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

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

module.exports.addNewMovie = async (req, res) => {
  const { movieFullName, bookingStatus, releaseDate } = req.body;
  try {
    let dateParts = releaseDate.split("-");
    let dt = new Date(
      parseInt(dateParts[2], 10),
      parseInt(dateParts[1], 10),
      parseInt(dateParts[0], 10)
    );
    let movie = new Movie({
      movieFullName: movieFullName,
      movieName: movieFullName.replaceAll(" ", "").toLowerCase(),
      bookingStatus: bookingStatus,
      releaseDate: dt,
    });
    await movie.save();
    logger.info("Movie added successfully");
    return res.status(200).send("Movie added successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.updateMovie = async (req, res) => {
  const { movieFullName, bookingStatus, releaseDate } = req.body;
  try {
    let movie = await Movie.findOne({
      movieName: req.params.moviename,
    });
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    let dateParts = releaseDate.split("-");
    let dt = new Date(
      parseInt(dateParts[2], 10),
      parseInt(dateParts[1], 10),
      parseInt(dateParts[0], 10)
    );

    (movie.movieFullName = movieFullName),
      (movie.movieName = movieFullName.replaceAll(" ", "").toLowerCase()),
      (movie.bookingStatus = bookingStatus),
      (movie.releaseDate = dt),
      await movie.save();
    logger.info("Movie updated successfully");
    return res.status(200).send("Movie updated successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};
module.exports.deleteMovie = async (req, res) => {
  try {
    let movie = await Movie.findOne({
      movieName: req.params.moviename,
    });
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    await movie.deleteOne();
    logger.info("Movie removed successfully");
    return res.status(200).send("Movie deleted successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

const Movie = require("../models/Movie");

const { logger } = require("../../config/logger");
const moment = require("moment");

const { isAfter } = require("../utils/momentHelpers");

module.exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseDate: -1 });
    return res.status(200).json(movies);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.getMovie = async (req, res) => {
  const { movieName } = req.params;
  try {
    let movie = await Movie.findOne({
      movieName: movieName,
    });
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    logger.info("Movie Found");
    return res.status(200).send(movie);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.searchMovie = async (req, res) => {
  try {
    const movie = await Movie.find({
      movieFullName: new RegExp(req.params.query, "igm"),
    });
    return res.json(movie);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.addNewMovie = async (req, res) => {
  const { movieFullName, movieLength, bookingStatus, releaseDate } = req.body;
  try {
    let dt = moment(releaseDate, "DD-MM-YYYY HH:mm:ss").local().format();
    let movie = new Movie({
      movieFullName: movieFullName,
      movieName: movieFullName.replaceAll(" ", "").toLowerCase(),
      movieLength: movieLength,
      bookingStatus: bookingStatus,
      releaseDate: dt,
    });
    await movie.save();
    logger.info("Movie added successfully");
    return res
      .status(200)
      .json({ message: "Movie added successfully", movieID: movie._id });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.updateMovie = async (req, res) => {
  const { movieFullName, movieLength, bookingStatus, releaseDate } = req.body;
  try {
    let movie = await Movie.findOne({
      movieName: req.params.moviename,
    });
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    let dt = moment(releaseDate, "DD-MM-YYYY").toDate();
    (movie.movieFullName = movieFullName),
      (movie.movieName = movieFullName.replaceAll(" ", "").toLowerCase()),
      (movie.bookingStatus = bookingStatus),
      (movie.movieLength = movieLength),
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

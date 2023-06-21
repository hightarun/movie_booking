const config = require("config");
const server = config.get("server");
const auth = config.get("auth");
const User = require("../models/User");
const Movie = require("../models/Movie");
const Show = require("../models/Show");
const { logger } = require("../../config/logger");
const moment = require("moment");

module.exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseDate: -1 });
    return res.json(movies);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.addNewMovie = async (req, res) => {
  const { movieFullName, bookingStatus, releaseDate } = req.body;
  try {
    let dt = moment(releaseDate).toDate();
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

module.exports.addShow = async (req, res) => {
  const { theatreID, movieID, showTime, showPrice } = req.body;
  try {
    let dt = moment(showTime, "DD-MM-YYYY HH:mm:ss").toDate();
    let show = new Show({
      theatreID: theatreID,
      movieID: movieID,
      showTime: dt,
      showPrice: showPrice,
    });
    await show.save();
    logger.info("Show added successfully");
    return res.status(200).send("Show added successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.updateShow = async (req, res) => {
  const { theatreID, movieID, showTime, showPrice } = req.body;

  try {
    let show = Show.findById(req.params.showID);
    if (!show) {
      return res.status(404).send("Movie not found");
    }
    let dt = moment(showTime, "DD-MM-YYYY HH:mm:ss").toDate();
    (show.theatreID = theatreID),
      (show.movieID = movieID),
      (show.showTime = dt),
      (show.showPrice = showPrice),
      await show.save();
    logger.info("Show updated successfully");
    return res.status(200).send("Show updated successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.deleteShow = async (req, res) => {
  try {
    let show = await Show.findById(req.params.showID);
    if (!show) {
      return res.status(404).send("Show not found");
    }
    await show.deleteOne();
    logger.info("Show removed successfully");
    return res.status(200).send("Show deleted successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

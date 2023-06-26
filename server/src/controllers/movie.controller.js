const config = require("config");
const server = config.get("server");
const auth = config.get("auth");
const User = require("../models/User");
const Movie = require("../models/Movie");
const Show = require("../models/Show");
const { logger } = require("../../config/logger");
const moment = require("moment");
const Theatre = require("../models/Theatre");
const {
  isBetweenTwoDateTime,
  durationBetween,
  isAfter,
} = require("../utils/momentHelpers");

module.exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseDate: -1 });
    return res.json(movies);
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
    let dt = moment(releaseDate, "DD-MM-YYYY").toDate();
    let movie = new Movie({
      movieFullName: movieFullName,
      movieName: movieFullName.replaceAll(" ", "").toLowerCase(),
      movieLength: movieLength,
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

module.exports.addShow = async (req, res) => {
  const { theatreID, movieID, showStartTime, showPrice } = req.body;
  try {
    let movie = await Movie.findById(movieID);
    let theatre = await Theatre.findById(theatreID);
    let showStartTimeISO = moment(showStartTime, "DD-MM-YYYY HH:mm:ss")
      .local()
      .format();
    let [h, m] = movie.movieLength.split(":");
    let movieLength = +h + m / 60;
    let showEndTimeISO = moment(showStartTimeISO)
      .add(moment.duration(movieLength, "hours"))
      .local()
      .format();

    let movieReleaseDate = moment(movie.releaseDate).local().format();
    let checkReleaseDate = isAfter(movieReleaseDate, showStartTimeISO);
    if (checkReleaseDate) {
      seatCheckFlag = false;
      return res
        .status(200)
        .send("Invalid, show timing is before release time");
    }
    if (theatre.showSeatDetails.length > 0) {
      return theatre.showSeatDetails.forEach(async (seatsAvailable, index) => {
        let show = await Show.findById(seatsAvailable.showID);
        let showStartTime = moment(show.showStartTime).local().format();
        let showEndTime = moment(show.showEndTime).local().format();
        let isBetween = isBetweenTwoDateTime(
          showStartTimeISO,
          showStartTime,
          showEndTime
        );
        let movieDuration = durationBetween(showStartTime, showEndTime);
        let durationBetweenPreviousMovie = durationBetween(
          showEndTime,
          showStartTimeISO
        );
        let isConflictingPreviousMovie =
          durationBetweenPreviousMovie < movieDuration + 0.5 &&
          durationBetweenPreviousMovie > 0;
        console.log("here");
        if (!isBetween && !isConflictingPreviousMovie) {
          let show = new Show({
            theatreID: theatreID,
            movieID: movieID,
            showStartTime: showStartTimeISO,
            showEndTime: showEndTimeISO,
            showPrice: showPrice,
          });
          let savedShow = await show.save();
          logger.info("Show added successfully");
          const showSeatDetail = {
            showID: savedShow._id,
            seatsAvailable: theatre.totalSeats,
          };
          theatre.showSeatDetails.unshift(showSeatDetail);
          await theatre.save();
          logger.info("Seats updated successfully");
          return res.status(200).send("Show added successfully");
        } else if (isBetween) {
          return res.status(200).send("Theatre occupied");
        } else if (isConflictingPreviousMovie) {
          return res.status(200).send("Theatre occupied");
        }
      });
    } else {
      let show = new Show({
        theatreID: theatreID,
        movieID: movieID,
        showStartTime: showStartTimeISO,
        showEndTime: showEndTimeISO,
        showPrice: showPrice,
      });
      let savedShow = await show.save();
      logger.info("Show added successfully");
      const showSeatDetail = {
        showID: savedShow._id,
        seatsAvailable: theatre.totalSeats,
      };
      theatre.showSeatDetails.unshift(showSeatDetail);
      await theatre.save();
      logger.info("Seats updated successfully");
      return res.status(200).send("Show added successfully");
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send("Server Error");
  }
};

// module.exports.deleteShow = async (req, res) => {
//   try {
//     let show = await Show.findById(req.params.showID);
//     if (!show) {
//       return res.status(404).send("Show not found");
//     }
//     await show.deleteOne();
//     logger.info("Show removed successfully");
//     return res.status(200).send("Show deleted successfully");
//   } catch (err) {
//     logger.error(err.message);
//     res.status(500).send("Server Error");
//   }
// };

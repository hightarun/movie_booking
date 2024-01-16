const Movie = require("../models/Movie");
const Show = require("../models/Show");
const { logger } = require("../../config/logger");
const moment = require("moment");
const Theatre = require("../models/Theatre");
const { isAfter } = require("../utils/momentHelpers");

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
    let show = new Show({
      theatreID: theatre._id,
      movieID: movie._id,
      showStartTime: showStartTimeISO,
      showEndTime: showEndTimeISO,
      showPrice: showPrice,
    });
    let savedShow = await show.save();
    logger.info("Show added successfully");
    return res.status(200).send("Show added successfully");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports.getAllShow = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate({ path: "movieID theatreID" })
      .exec();
    return res.status(200).json(shows);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.getShow = async (req, res) => {
  const { showId } = req.params;
  try {
    let show = await Show.findById(showId)
      .populate({ path: "movieID theatreID" })
      .exec();
    if (!show) {
      return res.status(404).send("Show not found");
    }
    logger.info("Show Found");
    return res.status(200).send(show);
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

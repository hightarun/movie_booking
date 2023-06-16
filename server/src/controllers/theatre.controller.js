const config = require("config");
const server = config.get("server");
const auth = config.get("auth");
const User = require("../models/User");
const Movie = require("../models/Movie");
const Theatre = require("../models/Theatre");
const { logger } = require("../../config/logger");

module.exports.getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find();
    return res.json(theatres);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.addNewTheatre = async (req, res) => {
  const { theatreNo, totalSeats } = req.body;
  try {
    let theatre = new Theatre({
      theatreNo: theatreNo,
      totalSeats: totalSeats,
      availableSeats: totalSeats,
    });
    await theatre.save();
    logger.info("Theatre added successfully");
    return res.status(200).send("Theatre added successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.updateTheatre = async (req, res) => {
  const { theatreNo, totalSeats, availableSeats } = req.body;
  try {
    console.log(req.params.theatre);
    let theatre = await Theatre.findOne({
      theatreNo: req.params.theatre,
    });
    if (!theatre) {
      return res.status(404).send("Theatre not found");
    }
    theatre.theatreNo = theatreNo;
    theatre.totalSeats = totalSeats;
    theatre.availableSeats = availableSeats;
    await theatre.save();
    logger.info("Theatre updated successfully");
    return res.status(200).send("Theatre updated successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};
module.exports.deleteTheatre = async (req, res) => {
  try {
    let theatre = await Theatre.findOne({
      theatreNo: req.params.theatre,
    });
    if (!theatre) {
      return res.status(404).send("Theatre not found");
    }
    await theatre.deleteOne();
    logger.info("Theatre removed successfully");
    return res.status(200).send("Theatre deleted successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

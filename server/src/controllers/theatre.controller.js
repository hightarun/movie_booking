const config = require("config");
const server = config.get("server");
const auth = config.get("auth");
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
    let checkTheatre = await Theatre.findOne({ theatreNo: theatreNo });
    if (checkTheatre) {
      return res.status(200).json({ message: "Theatre already Exists" });
    }
    let theatre = new Theatre({
      theatreNo: theatreNo,
      totalSeats: totalSeats,
    });
    await theatre.save();
    logger.info("Theatre added successfully");
    return res.status(200).json({ message: "Theatre added successfully" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.updateTheatre = async (req, res) => {
  const { totalSeats } = req.body;
  try {
    let theatre = await Theatre.findOne({ theatreNo: req.params.theatreNo });
    if (!theatre) {
      return res.status(404).send("Theatre not found");
    }
    theatre.totalSeats = totalSeats;
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

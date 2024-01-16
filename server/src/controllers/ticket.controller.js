const config = require("config");
const server = config.get("server");
const auth = config.get("auth");
const moment = require("moment");
const User = require("../models/User");
const Movie = require("../models/Movie");
const { logger } = require("../../config/logger");
const Ticket = require("../models/Ticket");
const Theatre = require("../models/Theatre");
const Show = require("../models/Show");
const { isBetweenTwoDateTime } = require("../utils/momentHelpers");

module.exports.bookTicket = async (req, res) => {
  const { showId, noOfTickets } = req.body;
  try {
    let show = await Show.findById(showId);
    if (!show) {
      return res.status(200).send("No show found ");
    }

    let theatre = await Theatre.findById(show.theatreID);
    if (theatre.totalSeats <= noOfTickets) {
      return res.status(200).send("No seats available");
    }

    let totalTicketPrice = show.showPrice * noOfTickets;

    let ticket = new Ticket({
      userID: req.user.id,
      showID: showId,
      noOfTickets: noOfTickets,
      totalTicketPrice: totalTicketPrice,
    });
    await ticket.save();
    logger.info("Ticket booked successfully");

    // updating theatre seats
    theatre.totalSeats = theatre.totalSeats - noOfTickets;
    await theatre.save();
    logger.info("Available seats updated successfully");

    return res
      .status(200)
      .json({ message: "Ticket Booked!!", ticketID: ticket._id });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userID: req.user.id })
      .populate({ path: "userID", select: "_id name username" })
      .populate({ path: "showID", populate: { path: "theatreID movieID" } })
      .exec();
    return res.status(200).json(tickets);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketID);
    if (!ticket) {
      logger.error("Ticket not found");
      return res.status(404).send("Ticket not found");
    }
    const show = await Show.findById(ticket.showId);
    const theatre = await Theatre.findById(show.theatreID);

    // updating theatre seats
    if (theatre.showID.equals(ticket.showId)) {
      theatre.totalSeats = theatre.totalSeats + ticket.noOfTickets;
      await theatre.save();
      logger.info("Theatre seats updated");
    }

    await ticket.deleteOne();
    logger.info("Ticket removed successfully");
    return res.status(200).send("Ticket deleted successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

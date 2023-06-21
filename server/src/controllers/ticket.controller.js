const config = require("config");
const server = config.get("server");
const auth = config.get("auth");
const User = require("../models/User");
const Movie = require("../models/Movie");
const { logger } = require("../../config/logger");
const Ticket = require("../models/Ticket");

module.exports.bookTicket = async (req, res) => {
  const { showDetails, noOfTickets, seatsBooked } = req.body;
  try {
    const SEATS_REGEX = /^[A-Z][1-9][0-9]$|^[A-Z]0?[1-9]$/;
    await seatsBooked.forEach((seat) => {
      if (!SEATS_REGEX.test(seat)) {
        return res.status(422).send("Seat number is invalid");
      }
    });

    if (noOfTickets != seatsBooked.length) {
      return res
        .status(422)
        .send("No of tickets mismatches number of seats booked");
    }
    let ticket = new Ticket({
      userID: req.user.id,
      showDetails: showDetails,
      noOfTickets: noOfTickets,
      seatsBooked: seatsBooked,
    });
    await ticket.save();
    logger.info("Ticket booked successfully");
    return res.status(200).send("Ticket Booked!!");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.updateTicket = async (req, res) => {
  const { showDetails, noOfTickets, seatsBooked } = req.body;
  try {
    let ticket = await Ticket.findById(req.params.ticketID);
    if (!ticket) {
      logger.error("Ticket not found");
      return res.status(404).send("Ticket not found");
    }
    let seatsFlag = false;
    const SEATS_REGEX = /^[A-Z][1-9][0-9]$|^[A-Z]0?[1-9]$/;
    await seatsBooked.forEach((seat) => {
      if (!SEATS_REGEX.test(seat)) {
        seatsFlag = true;
      }
    });
    if (seatsFlag) {
      return res.status(422).send("Seat number is invalid");
    }
    if (noOfTickets != seatsBooked.length) {
      return res
        .status(422)
        .send("No of tickets mismatches number of seats booked");
    }

    (ticket.showDetails = showDetails),
      (ticket.noOfTickets = noOfTickets),
      (ticket.seatsBooked = seatsBooked),
      await ticket.save();
    logger.info("Ticket updated successfully");
    return res.status(200).send("Ticket Updated!!");
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
    await ticket.deleteOne();
    logger.info("Ticket removed successfully");
    return res.status(200).send("Ticket deleted successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

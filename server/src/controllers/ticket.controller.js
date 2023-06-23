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
    let show = await Show.findById(showDetails);
    let theatre = await Theatre.findById(show.theatreID);
    let dt = moment(show.showTime, "DD-MM-YYYY HH:mm:ss").local().format();

    return theatre.availableSeats.forEach(async (seatsObj) => {
      let checkBetween = moment(dt).isBetween(
        moment(seatsObj.showStartTime),
        moment(seatsObj.showEndTime),
        null,
        []
      );
      if (checkBetween && seatsObj.seats < noOfTickets) {
        return res.status(200).send("No seats available");
      }
      if (checkBetween && seatsObj.seats >= noOfTickets) {
        let ticket = new Ticket({
          userID: req.user.id,
          showDetails: showDetails,
          noOfTickets: noOfTickets,
          seatsBooked: seatsBooked,
        });
        await ticket.save();
        logger.info("Ticket booked successfully");
        seatsObj.seats = seatsObj.seats - noOfTickets;
        await theatre.save();
        logger.info("Available seats updated successfully");
        return res.status(200).send("Ticket Booked!!");
      }
    });
    return res.status(404).send("Show not found");
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

    let theatre = Theatre.findById(showDetails.theatreID);
    let dt = moment(showDetails.showTime, "DD-MM-YYYY HH:mm:ss")
      .local()
      .format();
    theatre.availableSeats.forEach(async (seats) => {
      let checkBetween = moment(dt).isBetween(
        moment(seats.showStartTime),
        moment(seats.showEndTime)
      );
      if (checkBetween && seats.seat < noOfTickets) {
        return res.status(204).send("No seats available");
      }
      if (checkBetween && seats.seat >= noOfTickets) {
        (ticket.showDetails = showDetails),
          (ticket.noOfTickets = noOfTickets),
          (ticket.seatsBooked = seatsBooked),
          await ticket.save();
        logger.info("Ticket updated successfully");
        seats.seat = seats.seat - noOfTickets;
        await theatre.save();
        logger.info("Available seats updated successfully");
        return res.status(200).send("Ticket Updated!!");
      }
      return res.status(404).send("Show not found");
    });
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

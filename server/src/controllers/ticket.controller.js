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
    let shows = await Show.findById(showDetails);
    if (!shows) {
      return res.status(200).send("No show found ");
    }
    let theatre = await Theatre.findById(shows.theatreID);

    return theatre.showSeatDetails.forEach(async (show) => {
      if (show.showID == showDetails) {
        let seatsAvailable = theatre.totalSeats - show.seatsAvailable;
        if (seatsAvailable >= noOfTickets) {
          return res.status(200).send("No seats available");
        }

        let totalTicketPrice = shows.showPrice * noOfTickets;
        let ticket = new Ticket({
          userID: req.user.id,
          showDetails: showDetails,
          noOfTickets: noOfTickets,
          seatsBooked: seatsBooked,
          totalTicketPrice: totalTicketPrice,
        });
        await ticket.save();
        logger.info("Ticket booked successfully");
        show.seatsAvailable = show.seatsAvailable - noOfTickets;
        await theatre.save();
        logger.info("Available seats updated successfully");
        return res
          .status(200)
          .json({ message: "Ticket Booked!!", ticketID: ticket._id });
      }
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.updateTicket = async (req, res) => {
  const { noOfTickets, seatsBooked } = req.body;
  try {
    let ticket = await Ticket.findById(req.params.ticketID);
    if (!ticket) {
      return res.status(200).send("Ticket not found");
    }
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

    let shows = await Show.findById(ticket.showDetails);
    if (!shows) {
      return res.status(200).send("No show found ");
    }
    let theatre = await Theatre.findById(shows.theatreID);

    return theatre.showSeatDetails.forEach(async (show) => {
      if (show.showID.equals(ticket.showDetails)) {
        let seatsAvailable = theatre.totalSeats - show.seatsAvailable;
        if (seatsAvailable >= noOfTickets) {
          return res.status(200).send("No seats available");
        }
        let totalTicketPrice = shows.showPrice * noOfTickets;
        ticket.noOfTickets = noOfTickets;
        ticket.seatsBooked = seatsBooked;
        ticket.totalTicketPrice = totalTicketPrice;
        //await ticket.save();
        logger.info("Ticket updated successfully");
        show.seatsAvailable = show.seatsAvailable - noOfTickets;
        //await theatre.save();
        logger.info("Available seats updated successfully");
        return res.status(200).send("Ticket Updated!!");
      }
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
    const show = await Show.findById(ticket.showDetails);
    const theatre = await Theatre.findById(show.theatreID);
    theatre.showSeatDetails.forEach(async (sho) => {
      if (sho.showID.equals(ticket.showDetails)) {
        sho.seatsAvailable = sho.seatsAvailable + ticket.noOfTickets;
        await theatre.save();
        logger.info("Theatre seats updated");
      }
    });
    await ticket.deleteOne();
    logger.info("Ticket removed successfully");
    return res.status(200).send("Ticket deleted successfully");
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
};

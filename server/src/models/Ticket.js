const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: [true, "User Id is required"],
  },
  movieName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: [true, "Movie name is required"],
  },
  theatreNo: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Theatre name is required"],
    ref: "Theatre",
  },
  movieDateTime: {
    type: Date,
    default: null,
    required: [true, "Movie Date and time is required"],
  },
  ticketPrice: {
    type: String,
    default: null,
    required: [true, "Ticket price is required"],
  },
  noOfTickets: {
    type: Number,
    default: null,
    required: [true, "numberOfTickets is required"],
  },
  seatsBooked: {
    type: [String],
    required: [true, "Seat Numbers are required"],
  },
});

module.exports = Ticket = mongoose.model("ticket", TicketSchema);

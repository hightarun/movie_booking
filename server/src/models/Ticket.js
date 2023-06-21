const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User Id is required"],
  },
  showDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "show",
    required: [true, "Show details are required"],
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

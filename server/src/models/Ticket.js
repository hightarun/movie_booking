const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User Id is required"],
  },
  showID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "show",
    required: [true, "Show details are required"],
  },
  noOfTickets: {
    type: Number,
    default: null,
    required: [true, "Number of ticket is required"],
  },
  totalTicketPrice: {
    type: Number,
    required: [true, "Total Ticket price is required"],
  },
});

module.exports = Ticket = mongoose.model("ticket", TicketSchema);

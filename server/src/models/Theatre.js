const mongoose = require("mongoose");

const TheatreSchema = new mongoose.Schema({
  theatreNo: {
    type: String,
    required: [true, "Theatre no. is required"],
  },
  totalSeats: {
    type: Number,
    required: [true, "Total seat number is required"],
  },
  availableSeats: {
    type: Number,
    required: [true, "Number of seats available is required"],
  },
});

module.exports = Theatre = mongoose.model("theatre", TheatreSchema);

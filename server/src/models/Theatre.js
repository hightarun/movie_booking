const mongoose = require("mongoose");

const TheatreSchema = new mongoose.Schema({
  theatreNo: {
    type: String,
    unique: true,
    required: [true, "Theatre no. is required"],
  },
  totalSeats: {
    type: Number,
    required: [true, "Total seat number is required"],
  },
  showSeatDetails: [
    {
      showID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "show",
      },
      seatsAvailable: { type: Number },
    },
  ],
});

module.exports = Theatre = mongoose.model("theatre", TheatreSchema);

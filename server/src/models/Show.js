const mongoose = require("mongoose");

const ShowSchema = new mongoose.Schema({
  theatreID: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Theatre is required"],
    sparse: true,
    ref: "theatre",
  },
  movieID: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Movie name is required"],
    sparse: true,
    ref: "movie",
  },
  showTime: {
    type: Date,
    required: [true, "Show timing is required"],
  },
  showPrice: {
    type: String,
    required: [true, "Show price is required"],
  },
});

module.exports = Show = mongoose.model("show", ShowSchema);

const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  movieFullName: {
    type: String,
    min: [1, "Minimum 1 characters is required"],
    unique: [true, "Movie Name should be unique"],
    required: [true, "Movie Full Name is required"],
  },
  movieName: {
    type: String,
    min: [1, "Minimum 1 characters is required"],
    unique: [true, "Movie Name should be unique"],
    trim: true,
    required: [true, "Movie Name is required"],
  },
  movieLength: {
    type: String,
    default: "03:00",
    required: [true, "Movie length is required"],
  },
  bookingStatus: {
    type: Boolean,
    required: [true, "Booking status is required"],
  },
  releaseDate: {
    type: Date,
    default: null,
    required: [true, "Release date is required"],
  },
});

module.exports = Movie = mongoose.model("movie", MovieSchema);

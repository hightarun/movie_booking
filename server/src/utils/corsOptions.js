let allowedOrigins = [
  "https://localhost:3000",
  "http://localhost:3000/",
  "http://localhost:3000",
  "http://192.168.0.128:3000/",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) === -1) {
      let msg =
        "The cors policy for this site does not allow access from the specified Origin";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

module.exports = corsOptions;

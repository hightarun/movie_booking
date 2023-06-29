const config = require("config");
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const corsOptions = require("./src/utils/corsOptions");
const compressionOptions = require("./src/utils/compressionOptions");
const helmet = require("helmet");
const { logger } = require("./config/logger");
const connectDB = require("./config/init_db");
const app = express();
const serverEnv = config.get("server");

app.use(cors(corsOptions));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use("/public", express.static(path.join(__dirname + "/public")));
app.use(compression(compressionOptions));

// connecting DB
connectDB();

app.use(express.json({ extended: false, limit: "50mb" }));

//routes
app.use("/api/moviebooking", require("./src/routes/app.routes"));
app.get("/*", (req, res) => {
  //res.send("API WORKING");
  return res.status(401).json({ msg: "Not Authorized" });
});

//Error Handling Middleware
const errorHandler = require("./src/middlewares/error.middleware");
app.use(errorHandler);

const PORT = serverEnv.port;
const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

module.exports = server;

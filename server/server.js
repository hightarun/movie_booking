const config = require("config");
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const corsOptions = require("./src/utils/corsOptions");
const compressionOptions = require("./src/utils/compressionOptions");
const helmet = require("helmet");
const log = require("npmlog");
const connectDB = require("./config/init_db");
const app = express();
const server = config.get("server");

// cors
app.use(cors(corsOptions));
// helmet for security
app.use(helmet({ crossOriginResourcePolicy: false }));
// public static path
app.use("/public", express.static(path.join(__dirname + "/public")));
// for compressed response
app.use(compression(compressionOptions));

// connecting DB
connectDB();

//to get data in req.body
app.use(express.json({ extended: false, limit: "50mb" }));

app.get("/", (req, res) => {
  //res.send("API WORKING");
  return res.status(401).json({ msg: "Not Authorized" });
});

//routes
app.use("/api/moviebooking", require("./src/routes/authentication"));
app.use("/api/confirmation", require("./src/routes/confirmation"));

const PORT = server.port;
app.listen(PORT, () => {
  log.info("Success: ", `Server started on port ${PORT}`);
});

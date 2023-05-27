const mongoose = require("mongoose");
const log = require("npmlog");

const config = require("config");
const db = config.get("db");

const connString = `mongodb://${db.username}:${db.password}@${db.host}:${db.port}/${db.name}?authSource=admin&retryWrites=true&w=majority`;

const connectDB = () => {
  try {
    mongoose.connect(connString);
    log.info("Success: ", `Database connected at port ${db.port}`);
  } catch (err) {
    log.error("Error: ", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

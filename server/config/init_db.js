const mongoose = require("mongoose");
const { logger } = require("./logger");

const config = require("config");
const db = config.get("db");

const connString = `mongodb://${db.username}:${db.password}@${db.host}:${db.port}/${db.name}?authSource=admin&retryWrites=true&w=majority`;

const connectDB = () => {
  try {
    mongoose.connect(connString);
    logger.info(`Database connected at port ${db.port}`);
  } catch (err) {
    logger.error(`Error connecting to database: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

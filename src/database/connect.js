const mongoose = require("mongoose");
const config = require("../config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoDbUri);
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;

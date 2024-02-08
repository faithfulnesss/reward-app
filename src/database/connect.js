const mongoose = require("mongoose");
const config = require("../config");
const logger = require("../utils/logger");

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoDbUri);
        mongoose.set("debug", true);
    } catch (error) {
        logger.error(error);
    }
};

module.exports = connectDB;

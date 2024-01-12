const mongoose = require("mongoose");
const config = require("../config");

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoDbUri);
        mongoose.set("debug", true);
    } catch (error) {
        console.error(error);
    }
};

module.exports = connectDB;

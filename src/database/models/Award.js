const mongoose = require("mongoose");

const awardSchema = new mongoose.Schema({
  Type: {
    type: String,
    enum: ["HR & Business", "Employer Brand", "Talent Acquisition"],
  },
  Name: String,
  Stars: Number,
  Details: String,
});

const AwardModel = mongoose.model("Award", awardSchema);

module.exports = AwardModel;

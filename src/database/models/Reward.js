const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  Name: String,
  URL: {
    type: String,
    required: false,
  },
  Points: Number,
  Value: String,
  Description: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const RewardModel = mongoose.model("Reward", rewardSchema);

module.exports = RewardModel;

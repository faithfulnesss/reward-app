const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  Name: String,
  Image: {
    type: String,
    required: false,
  },
  Price: Number,
  Value: String,
  Description: String,
});

const RewardModel = mongoose.model("Reward", rewardSchema);

module.exports = RewardModel;

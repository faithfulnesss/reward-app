const mongoose = require("mongoose");
const Employee = require("./Employee");
const Award = require("./Award");

const RewardRequestSchema = new mongoose.Schema({
  Reward: { type: mongoose.Schema.Types.ObjectId, ref: "Reward" },
  Employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  Status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  CreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RewardRequest", RewardRequestSchema);

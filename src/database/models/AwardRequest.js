const mongoose = require("mongoose");

const AwardRequestSchema = new mongoose.Schema({
  Award: { type: mongoose.Schema.Types.ObjectId, ref: "Award" },
  Employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  Status: {
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("AwardRequest", AwardRequestSchema);

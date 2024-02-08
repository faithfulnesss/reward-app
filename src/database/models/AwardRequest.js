const mongoose = require("mongoose");

const AwardRequestSchema = new mongoose.Schema({
    Award: { type: mongoose.Schema.Types.ObjectId, ref: "Award" },
    Employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    Status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    Responsible: { type: String },
    CreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AwardRequest", AwardRequestSchema);

const mongoose = require("mongoose");

const RecognitionSchema = new mongoose.Schema({
    Sender: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    Receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    Points: Number,
    Value: {
        type: String,
        enum: [
            "Trust",
            "Excel",
            "Team Up",
            "Follow the Data",
            "Innovate",
            "Deliver Results",
            "Be Passionate",
            "Unleash your Ambitions",
        ],
    },
    CreatedAt: { type: Date, default: Date.now },
});

const Recognition = mongoose.model("Recognition", RecognitionSchema);

module.exports = Recognition;

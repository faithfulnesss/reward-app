const mongoose = require("mongoose");

const awardSchema = new mongoose.Schema({
    Type: {
        type: String,
    },
    Name: String,
    Points: Number,
    Details: String,
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

const AwardModel = mongoose.model("Award", awardSchema);

module.exports = AwardModel;

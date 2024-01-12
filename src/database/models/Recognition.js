const mongoose = require("mongoose");
const Employee = require("./Employee");

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

// not sure how to implement this correctly
// from the abstraction-level perspective it seems that is fine
// as we are on the ActiveRecord model level and working with the
// Employee's model
RecognitionSchema.post("save", async function (doc) {
    try {
        const sender = await Employee.findById(doc.Sender);

        if (sender.Role !== "Employee") {
            if (sender.ManagerBalance >= doc.Points) {
                update = { $inc: { ManagerBalance: -doc.Points } };
            } else {
                const difference = doc.Points - sender.ManagerBalance;
                update = {
                    $set: { ManagerBalance: 0 },
                    $inc: { Balance: -difference },
                };
            }
        } else {
            update = { $inc: { Balance: -doc.Points } };
        }

        await Employee.findByIdAndUpdate(doc.Sender, update);

        await Employee.findByIdAndUpdate(doc.Receiver, {
            $inc: { Balance: doc.Points },
        });
    } catch (error) {
        console.error("An error occurred:", error);

        await Recognition.findByIdAndDelete(doc._id);
    }
});

const Recognition = mongoose.model("Recognition", RecognitionSchema);

module.exports = Recognition;

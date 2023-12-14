const mongoose = require("mongoose");
const Employee = require("./Employee");

const RecognitionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  points: Number,
  value: {
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
  createdAt: { type: Date, default: Date.now },
});

// not sure how to implement this correctly
// from the abstraction-level perspective it seems that is fine
// as we are on the ActiveRecord model level and working with the
// Employee's model
RecognitionSchema.post("save", async function (doc) {
  try {
    const sender = await Employee.findById(doc.sender);

    if (sender.Role !== "Employee") {
      if (sender.ManagerBalance >= doc.points) {
        update = { $inc: { ManagerBalance: -doc.points } };
      } else {
        const difference = doc.points - sender.ManagerBalance;
        update = {
          $set: { ManagerBalance: 0 },
          $inc: { Balance: -difference },
        };
      }
    } else {
      update = { $inc: { Balance: -doc.points } };
    }

    await Employee.findByIdAndUpdate(doc.sender, update);

    await Employee.findByIdAndUpdate(doc.receiver, {
      $inc: { Balance: doc.points },
    });
  } catch (error) {
    console.error("An error occurred:", error);

    await Recognition.findByIdAndDelete(doc._id);
  }
});

const Recognition = mongoose.model("Recognition", RecognitionSchema);

module.exports = Recognition;

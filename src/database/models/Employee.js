const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  SlackID: { type: String, required: true, unique: true },
  Name: { type: String, required: true },
  Role: {
    type: String,
    enum: ["Employee", "Manager", "HR"],
    default: "Employee",
  },
  Team: {
    type: String,
    enum: [
      "General",
      "Product",
      "Marketing",
      "Tech",
      "C-management",
      "Operations",
    ],
  },
  Balance: { type: Number, default: 0, min: 0 },
  ManagerBalance: {
    type: Number,
    min: 0,
    default: 0,
  },
  Joined: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;

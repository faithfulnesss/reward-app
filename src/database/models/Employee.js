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
    default: "Not Assigned",
  },
  Balance: { type: Number, default: 0, min: 0 },
  ManagerBalance: {
    type: Number,
    min: 0,
    default: 500,
  },
  Joined: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;

const Recognition = require("../models/Recognition");
// const Employee = require("../models/Employee");
const employeeRepository = require("./employeeRepository");

async function createRecognitions(
  senderSlackID,
  receiverSlackIDs,
  points,
  value
) {
  const createdRecognitions = [];

  try {
    const sender = await employeeRepository.getEmployee(senderSlackID);

    if (!sender) {
      throw new Error("Sender not found");
    }

    for (const receiverSlackID of receiverSlackIDs) {
      const receiver = await Employee.findOne({ SlackID: receiverSlackID });

      if (!receiver) {
        throw new Error(`Receiver not found for SlackID: ${receiverSlackID}`);
      }

      const recognition = new Recognition({
        sender: sender._id,
        receiver: receiver._id,
        points,
        value,
      });

      await recognition.save();
      createdRecognitions.push(recognition);
    }

    return true;
  } catch (error) {
    console.error("Error creating recognitions:", error);

    throw error;
  }
}

module.exports = {
  createRecognitions,
};

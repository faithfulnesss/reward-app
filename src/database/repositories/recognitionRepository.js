const Recognition = require("../models/Recognition");
const Employee = require("../models/Employee");
const employeeRepository = require("./employeeRepository");

async function createRecognitions(
  senderSlackID,
  receiverSlackIDs,
  points,
  value
) {
  const createdRecognitions = [];

  const sender = await employeeRepository.getEmployee({
    SlackID: senderSlackID,
  });

  if (!sender) {
    throw new Error("Sender not found");
  }

  for (const receiverSlackID of receiverSlackIDs) {
    const receiver = await employeeRepository.getEmployee({
      SlackID: receiverSlackID,
    });

    if (!receiver) {
      throw new Error(`Receiver not found for SlackID: ${receiverSlackID}`);
    }

    const recognition = new Recognition({
      Sender: sender._id,
      Receiver: receiver._id,
      Points: points,
      Value: value,
    });

    await recognition.save();
    createdRecognitions.push(recognition);
  }

  return createdRecognitions.length === receiverSlackIDs.length;
}

module.exports = {
  createRecognitions,
};

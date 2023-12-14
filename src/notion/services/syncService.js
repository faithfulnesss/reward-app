const config = require("../../config");
const getChannelMembers = require("../../slack/utils/getChannelMembers");
const notionService = require("./notionService");
const awardsService = require("../../database/repositories/awardRepository");

// to-do
// implement a functions to sync records between the notion and database
// with specific logic
// for example if we sync the AwardRequest with notion and
// this request's status has been updated to the "Approved" - then add points
// to the employee's balance

// module.exports = { };

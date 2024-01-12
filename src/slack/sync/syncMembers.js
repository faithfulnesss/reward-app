const logger = require("../../sync/logger");
const config = require("../../config");

const employeesService = require("../../database/repositories/employeeRepository");

async function getChannelMembers(client, channelId) {
  try {
    // SlackIDs of the members are being fetched from the specific channel
    // in the future channelId will contain obrio-general channel id
    const result = await client.client.conversations.members({
      channel: channelId,
      limit: 1000,
    });

    const members = [];

    for (const memberId of result.members) {
      const { user } = await client.client.users.info({ user: memberId });

      members.push(user);
    }

    return members;
  } catch (error) {
    console.error(error);
  }
}

async function createMissingEmployees(client) {
  try {
    const channelMembers = await getChannelMembers(client, config.channelId);

    for (const member of channelMembers) {
      const slackId = member.id;

      const employee = await employeesService.getEmployee({ SlackID: slackId });

      if (!employee) {
        logger.info(
          { SlackID: slackId, Name: member.profile.real_name },
          "Creating missing employee"
        );
        await employeesService.createEmployee(
          slackId,
          member.profile.real_name
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getChannelMembers,
  createMissingEmployees,
};

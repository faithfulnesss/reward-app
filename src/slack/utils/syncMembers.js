const config = require("../../config");
const app = require("../client");
const employeesService = require("../../database/repositories/employeeRepository");
const connect = require("../../database/connect");

async function getChannelMembers(app) {
  try {
    // SlackIDs of the members are being fetched from the specific channel
    // in the future channelId will contain obrio-general channel id
    const result = await app.client.conversations.members({
      channel: config.channelId,
      limit: 1000,
    });

    const members = [];

    for (const memberId of result.members) {
      const { user } = await app.client.users.info({ user: memberId });

      members.push(user);
    }

    return members;
  } catch (error) {
    console.error(error);
  }
}

async function createMissingEmployees() {
  try {
    const channelMembers = await getChannelMembers(app);

    for (const member of channelMembers) {
      const slackId = member.id;

      const employee = await employeesService.getEmployee({ SlackID: slackId });

      if (!employee) {
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

// async function main() {
//   connect();

//   await createMissingEmployees();
// }

// main();

module.exports = {
  getChannelMembers,
  createMissingEmployees,
};

const config = require("../../config");
const app = require("../client");

async function getChannelMembers() {
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

module.exports = getChannelMembers;

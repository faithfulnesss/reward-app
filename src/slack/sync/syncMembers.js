const logger = require("../../utils/logger");
const config = require("../../config");

const employeeRepository = require("../../database/repositories/employeeRepository");

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
        logger.error(error);
    }
}

async function createMissingEmployees(client) {
    try {
        const channelMembers = await getChannelMembers(
            client,
            config.channelId
        );

        for (const member of channelMembers) {
            const slackId = member.id;

            const employee = await employeeRepository.getEmployee({
                SlackID: slackId,
            });

            if (!employee) {
                logger.info(
                    { SlackID: slackId, Name: member.profile.real_name },
                    "Creating missing employee"
                );
                await employeeRepository.createEmployee(
                    slackId,
                    member.profile.real_name
                );
            }
        }
    } catch (error) {
        logger.error(error);
    }
}

module.exports = {
    getChannelMembers,
    createMissingEmployees,
};

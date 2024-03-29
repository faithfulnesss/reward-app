require("dotenv").config();

const config = {
    port: process.env.PORT || 3000,
    slackBotToken: process.env.SLACK_BOT_TOKEN,
    slackSigningSecret: process.env.SLACK_SIGNING_SECRET,
    mongoDbUri: process.env.MONGODB_URI,
    notionToken: process.env.NOTION_TOKEN,
    rewardsDbId: process.env.REWARDS_DB_ID,
    employeesDbId: process.env.EMPLOYEES_DB_ID,
    generalChannelId: process.env.GENERAL_CHANNEL_ID,
    notificationsChannelId: process.env.NOTIFICATIONS_CHANNEL_ID,
    awardsDbId: process.env.AWARDS_DB_ID,
    awardRequestsDbId: process.env.AWARD_REQUESTS_DB_ID,
    rewardRequestsDbId: process.env.REWARD_REQUESTS_DB_ID,
};

module.exports = config;

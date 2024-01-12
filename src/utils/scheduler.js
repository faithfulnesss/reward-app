const cron = require("node-cron");
const logger = require("./logger");
const { createMissingEmployees } = require("../slack/sync/syncMembers");
const syncAwards = require("../notion/sync/syncRewards");

module.exports = async (client) => {
    // cron.schedule("* * * * *", async () => {
    //   logger.info("Running cron job - syncMembers");
    //   await createMissingEmployees(client);
    // });
    cron.schedule("* * * * *", async () => {
        logger.info("Running cron job - syncRewards");
        await Promise.all([syncAwards()]);
    });
};

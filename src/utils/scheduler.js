const cron = require("node-cron");
const { createMissingEmployees } = require("../slack/sync/syncMembers");
const {
    syncEmployees,
    syncAwards,
    syncRewards,
    syncAwardRequests,
    syncRewardRequests,
} = require("../notion/sync");
const {
    resetManagersBalance,
} = require("../database/repositories/employeeRepository");
const logger = require("./logger");

module.exports = async (client) => {
    cron.schedule("0 * * * *", async () => {
        logger.info("Running cron job - syncMembers");
        await createMissingEmployees(client);
        logger.info("Running cron job - syncEmployees");
        await syncEmployees();
        logger.info("Running cron job - syncAwards");
        await syncAwards();
        logger.info("Running cron job - syncRewards");
        await syncRewards();
        logger.info("Running cron job - syncAwardRequests");
        await syncAwardRequests();
        logger.info("Running cron job - syncRewardRequests");
        await syncRewardRequests();
    });
    cron.schedule("0 0 1 * *", async () => {
        logger.info("Resetting manager balances to 0");
        await resetManagersBalance();
    });
};

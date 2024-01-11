const cron = require("node-cron");
const logger = require("./logger");
const { createMissingEmployees } = require("../slack/utils/syncMembers");

module.exports = async (client) => {
  cron.schedule("* * * * *", async () => {
    logger.info("Running cron job - syncMembers");
    await createMissingEmployees(client);
  });
};

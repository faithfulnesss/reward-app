const notionService = require("../services/notionService");
const { rewardRepository } = require("../../database/repositories");
const logger = require("../../utils/logger");
const config = require("../../config");

// sync logic
// 1. get all rewards from notion
// 2. get all rewards from database
// 3. compare rewards from notion and database
// 4. if reward from notion is not in database - create it
// 5. if reward from notion is in database - update it
// 6. if reward from database is not in notion - delete it

async function syncRewards() {
    try {
        const notionRecords = (
            await notionService.getNotionRecords(config.rewardsDbId)
        ).map((page) => parseNotionRewards(page));

        const databaseRewards = await rewardRepository.getRewards();

        for (const record of notionRecords) {
            const databaseRecord = databaseRewards.find(
                (reward) => reward.Name === record.Name
            );

            if (!databaseRecord) {
                logger.info(`Creating reward ${record.Name}`);
                await rewardRepository.createReward(record);
            } else if (databaseRecord) {
                logger.info(`Updating reward ${record.Name}`);
                await rewardRepository.updateReward(databaseRecord._id, record);
            }
        }

        for (const record of databaseRewards) {
            const notionRecord = notionRecords.find(
                (reward) => reward.Name === record.Name
            );

            if (!notionRecord) {
                logger.info(`Deleting reward ${record.Name}`);
                await rewardRepository.softDeleteReward(record._id);
            }
        }
        return;
    } catch (error) {
        logger.error(error);
    }
}

const parseNotionRewards = (page) => {
    const { Name, Points, Value, Description, URL } = page.properties;
    return {
        Name: Name?.title[0]?.plain_text,
        Points: Points?.number,
        Value: Value?.rich_text[0]?.plain_text,
        Description: Description?.rich_text[0]?.plain_text,
        URL: URL?.url,
    };
};

module.exports = syncRewards;

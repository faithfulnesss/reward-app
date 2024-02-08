const notionService = require("../services/notionService");
const { awardRepository } = require("../../database/repositories");
const logger = require("../../utils/logger");
const config = require("../../config");

// sync logic
// 1. get all awards from notion
// 2. get all awards from database
// 3. compare awards from notion and database
// 4. if award from notion is not in database - create it
// 5. if award from notion is in database - update it
// 6. if award from database is not in notion - delete it

async function syncAwards() {
    try {
        const notionRecords = (
            await notionService.getNotionRecords(config.awardsDbId)
        ).map((page) => parseNotionAwards(page));

        const databaseAwards = await awardRepository.getAwards();

        for (const record of notionRecords) {
            const databaseRecord = databaseAwards.find(
                (award) => award.Name === record.Name
            );

            if (!databaseRecord) {
                logger.info(`Creating award ${record.Name}`);
                await awardRepository.createAward(record);
            } else if (databaseRecord) {
                logger.info(`Updating award ${record.Name}`);
                await awardRepository.updateAward(databaseRecord._id, record);
            }
        }

        for (const record of databaseAwards) {
            const notionRecord = notionRecords.find(
                (award) => award.Name === record.Name
            );

            if (!notionRecord) {
                logger.info(`Deleting award ${record.Name}`);
                await awardRepository.softDeleteAward(record._id);
            }
        }
    } catch (error) {
        logger.error(error);
    }
}

const parseNotionAwards = (page) => {
    const { Type, Name, Points, Details } = page.properties;
    return {
        Type: Type?.select?.name,
        Name: Name?.title[0]?.plain_text,
        Points: Points?.number,
        Details: Details?.rich_text[0]?.plain_text,
    };
};

module.exports = syncAwards;

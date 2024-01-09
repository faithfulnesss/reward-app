const config = require("../../config");
const notionService = require("../services/notionService");
const awardRepository = require("../../database/repositories/awardRepository");
const connect = require("../../database/connect");

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
        await awardRepository.createAward(record);
      } else if (databaseRecord) {
        await awardRepository.updateAward(databaseRecord._id, record);
      }
    }

    for (const record of databaseAwards) {
      const notionRecord = notionRecords.find(
        (award) => award.Name === record.Name
      );

      if (!notionRecord) {
        await awardRepository.deleteAward(record._id);
      }
    }
  } catch (error) {
    console.error(error);
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

async function main() {
  connect();
  await syncAwards();
}

main();

module.exports = syncAwards;

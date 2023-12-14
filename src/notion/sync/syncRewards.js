require("dotenv").config();
const notion = require("../client");
const Reward = require("../../database/models/Reward");
const connectDB = require("../../database/connect");

// code for syncing the Rewards records as the image
// for the Reward in notion is accessible with speicific
// AWS token for one hour only
// have been using this code to test the syncRewards function
// and display the Rewards
// in the future might impelement it in the syncService

async function processReward(page) {
  const { Name, Price, Value, Description } = page.properties;
  const imageBlock = await notion.blocks.children.list({ block_id: page.id });
  return {
    Name: Name?.title[0]?.plain_text,
    Image: imageBlock?.results[0]?.image?.file?.url,
    Price: Price?.number,
    Value: Value?.rich_text[0]?.plain_text,
    Description: Description?.rich_text[0]?.plain_text,
  };
}

async function syncRewards() {
  const databaseId = process.env.REWARDS_DB_ID;

  try {
    const database = await notion.databases.query({ database_id: databaseId });
    const rewards = await Promise.all(database.results.map(processReward));

    const bulkOps = rewards.map((reward) => ({
      updateOne: {
        filter: { Name: reward.Name },
        update: reward,
        upsert: true,
      },
    }));

    await Reward.bulkWrite(bulkOps);
  } catch (error) {
    console.error("Error in syncRewards:", error);
  }
}

module.exports = syncRewards;

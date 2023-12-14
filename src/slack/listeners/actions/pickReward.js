const pickRewardView = require("../../views/pickRewardView");
const Reward = require("../../../database/models/Reward");

module.exports = (app) => {
  app.action("click_pick_reward", async ({ ack, body, client }) => {
    await ack();

    const balance = 15000;

    try {
      const rewards = await Reward.find();
      await client.views.open({
        trigger_id: body.trigger_id,
        view: pickRewardView(rewards, balance),
      });
    } catch (error) {
      console.error(error);
    }
  });
};

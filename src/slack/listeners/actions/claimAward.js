const claimAwardView = require("../../views/claimAwardView");
const awardsService = require("../../../database/repositories/awardRepository");
const Award = require("../../../database/models/Award");

module.exports = (app) => {
  app.action("click_claim_award", async ({ ack, body, client }) => {
    await ack();

    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: claimAwardView(),
      });
    } catch (error) {
      console.error(error);
    }
  });

  app.action("award_category_selected", async ({ ack, body, client }) => {
    await ack();

    // to-do
    // get awards from the database by category and
    // display them in the view

    // after the form submission make a record in the database
  });
};

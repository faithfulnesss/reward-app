const balanceView = require("../../views/balanceView");
const employeesService = require("../../../database/repositories/employeeRepository");
const errorView = require("../../views/errorView");
module.exports = (app) => {
  app.action("click_check_balance", async ({ ack, body, client }) => {
    await ack();

    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: balanceView(balance),
      });
    } catch (error) {
      console.error(error);

      await client.views.open({
        trigger_id: body.trigger_id,
        view: errorView("Something went wrong!"),
      });
    }
  });
};

const giveRecognitionView = require("../../views/giveRecognitionView");
const employeesService = require("../../../database/repositories/employeeRepository");

module.exports = (app) => {
  app.action("click_give_recognition", async ({ ack, body, client }) => {
    await ack();

    try {
      const balance = await employeesService.getEmployeesBalance(body.user.id);

      await client.views.open({
        trigger_id: body.trigger_id,
        view: giveRecognitionView(balance),
      });
    } catch (error) {
      console.error(error);
    }
  });
};

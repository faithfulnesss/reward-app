const homeView = require("../../views/homeView");
const employeeRepository = require("../../../database/repositories/employeeRepository");
const errorView = require("../../views/errorView");

module.exports = (app) => {
  app.event("app_home_opened", async ({ event }) => {
    try {
      const employee = await employeeRepository.getEmployee({
        SlackID: event.user,
      });

      if (employee) {
        await app.client.views.publish({
          user_id: event.user,
          trigger_id: event.trigger_id,
          view: homeView(),
        });
      } else {
        await app.client.views.publish({
          user_id: event.user,
          trigger_id: event.trigger_id,
          view: restrictedView,
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
};

const restrictedView = {
  type: "home",
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*You are not authorized to use this app*\
        \nIf you are from OBRIO you should get access soon",
      },
    },
  ],
};

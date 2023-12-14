const homeView = require("../../views/homeView");

module.exports = (app) => {
  app.event("app_home_opened", async ({ event }) => {
    try {
      await app.client.views.publish({
        user_id: event.user,
        view: homeView(),
      });
    } catch (error) {
      console.error(error);
    }
  });
};

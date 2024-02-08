const leaderboardView = require("../../views/leaderboardView");
const openErrorView = require("./openErrorView");
const { employeeRepository } = require("../../../database/repositories");
const logger = require("../../../utils/logger");

module.exports = (app) => {
    app.action("open_leaderboard", async ({ ack, body, client }) => {
        try {
            await ack();

            var employees =
                await employeeRepository.getEmployeesSortedByBalanceDescending();

            await client.views.open({
                trigger_id: body.trigger_id,
                view: leaderboardView(employees, 1),
            });
        } catch (error) {
            logger.error(error);
            await openErrorView(client, body.trigger_id);
        }

        app.action(
            "leaderboard_previous",
            async ({ ack, body, client, action }) => {
                try {
                    await ack();
                    const currentPage = parseInt(action.value);

                    await client.views.update({
                        view_id: body.view.id,
                        view: leaderboardView(employees, currentPage),
                    });
                } catch (error) {
                    logger.error(error);
                    await openErrorView(client, body.trigger_id);
                }
            }
        );

        app.action(
            "leaderboard_next",
            async ({ ack, body, client, action }) => {
                try {
                    await ack();
                    const currentPage = parseInt(action.value);

                    await client.views.update({
                        view_id: body.view.id,
                        view: leaderboardView(employees, currentPage),
                    });
                } catch (error) {
                    logger.error(error);
                    await openErrorView(client, body.trigger_id);
                }
            }
        );
    });
};

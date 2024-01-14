const leaderboardView = require("../../views/leaderboardView");
const employeeRepository = require("../../../database/repositories/employeeRepository");

const PAGE_SIZE = 12;

module.exports = (app) => {
    app.action("open_leaderboard", async ({ ack, body, client }) => {
        await ack();

        try {
            var employees = await employeeRepository.getEmployees();

            await client.views.open({
                trigger_id: body.trigger_id,
                view: leaderboardView(employees, 1, PAGE_SIZE),
            });
        } catch (error) {
            console.error(error);
        }

        app.action(
            "leaderboard_previous",
            async ({ ack, body, client, action }) => {
                await ack();
                try {
                    const currentPage = parseInt(action.value);

                    await client.views.update({
                        view_id: body.view.id,
                        view: leaderboardView(
                            employees,
                            currentPage,
                            PAGE_SIZE
                        ),
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        );

        app.action(
            "leaderboard_next",
            async ({ ack, body, client, action }) => {
                await ack();
                try {
                    const currentPage = parseInt(action.value);

                    await client.views.update({
                        view_id: body.view.id,
                        view: leaderboardView(
                            employees,
                            currentPage,
                            PAGE_SIZE
                        ),
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        );
    });
};

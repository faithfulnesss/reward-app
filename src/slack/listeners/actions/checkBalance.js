const { employeeRepository } = require("../../../database/repositories");
const balanceView = require("../../views/balanceView");
const openErrorView = require("./openErrorView");
const logger = require("../../../utils/logger");

module.exports = (app) => {
    app.action("click_check_balance", async ({ ack, body, client }) => {
        try {
            await ack();

            const balance = await employeeRepository.getEmployeeBalance(
                body.user.id
            );

            await client.views.open({
                trigger_id: body.trigger_id,
                view: balanceView(balance),
            });
        } catch (error) {
            logger.error(error);

            await openErrorView(client, body.trigger_id);
        }
    });
};

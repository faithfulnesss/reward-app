const giveRecognitionView = require("../../views/giveRecognitionView");
const employeesService = require("../../../database/repositories/employeeRepository");
const errorView = require("../../views/errorView");

module.exports = (app) => {
    app.action("click_give_recognition", async ({ ack, body, client }) => {
        await ack();

        try {
            const employee = await employeesService.getEmployee({
                SlackID: body.user.id,
            });

            await client.views.open({
                trigger_id: body.trigger_id,
                view: giveRecognitionView(
                    employee.Balance,
                    employee.Role !== "Employee"
                        ? employee.ManagerBalance
                        : null
                ),
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

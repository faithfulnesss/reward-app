const giveRecognitionView = require("../../views/giveRecognitionView");
const {
    employeeRepository,
    recognitionRepository,
} = require("../../../database/repositories");
const openErrorView = require("./openErrorView");
const logger = require("../../../utils/logger");
const config = require("../../../config");

module.exports = (app) => {
    app.action("click_give_recognition", async ({ ack, body, client }) => {
        await ack();

        try {
            const employee = await employeeRepository.getEmployee({
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
            logger.error(error);
            await openErrorView(client, body.trigger_id);
        }
    });

    app.view("give_recognition_submit", async ({ ack, body, view, client }) => {
        await ack();

        const {
            amount_input: {
                amount: { value: points },
            },
            employees_input: {
                employees: { selected_conversations: employees },
            },
            message_input: {
                message: { value: message },
            },
            value_input: {
                "multi_static_select-action": { selected_option: value },
            },
            url_input: {
                "url_text_input-action": { value: url },
            },
        } = view.state.values;

        const managerPoints =
            view.state.values?.manager_amount_input?.manager_amount?.value ??
            null;

        try {
            const { balance, managerBalance } = JSON.parse(
                view.private_metadata
            );

            if (
                !(await validateRecognitionRequest(
                    client,
                    body,
                    employees,
                    points,
                    balance,
                    managerPoints,
                    managerBalance,
                    url
                ))
            ) {
                return;
            }

            const result = await recognitionRepository.createRecognitionsTest(
                body.user.id,
                employees,
                points,
                managerPoints,
                value.value
            );

            if (result) {
                let text = `${employees
                    .map((employee) => `<@${employee}>`)
                    .join(" ")} ${message} *${value.text.text}* +${
                    points ? points : 0 + managerPoints ? managerPoints : 0
                } :star: `;

                if (url) {
                    text += ` <${url}|:fire:>`;
                } else {
                    text += ":fire:";
                }

                await client.chat.postMessage({
                    channel: config.notificationsChannelId,
                    text: text,
                    mrkdwn: true,
                });
            } else {
                await openErrorView(
                    client,
                    body.trigger_id,
                    "Something went wrong!"
                );
            }
        } catch (error) {
            logger.error(error);
            await openErrorView(
                client,
                body.trigger_id,
                "Something went wrong!"
            );
        }
    });
};

async function validateRecognitionRequest(
    client,
    body,
    employees,
    points,
    balance,
    managerPoints,
    managerBalance,
    url
) {
    if (!(await checkEmployeesExist(employees))) {
        return await showError(
            "Some of the employees you selected don't exist in the database!"
        );
    } else if (employees.includes(body.user.id)) {
        return await showError("You can't give yourself recognition!");
    } else if (
        managerPoints &&
        employees.length * +managerPoints > +managerBalance
    ) {
        return await showError(
            "You don't have enough points on your manager balance to give that much recognition!"
        );
    } else if (employees.length * +points > +balance) {
        return await showError(
            "You don't have enough points to give that much recognition!"
        );
    } else if (
        +points === 0 &&
        (managerPoints === null || +managerPoints === 0)
    ) {
        return await showError("You can't give 0 points!");
    } else if (
        url &&
        !/^(https?:\/\/)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
            url
        )
    ) {
        console.log(url);
        return await showError("The URL is not valid!");
    }

    return true;

    async function showError(message) {
        await openErrorView(client, body.trigger_id, message);
        return false;
    }
}

async function checkEmployeesExist(employees) {
    const allEmployeesExist = await Promise.all(
        employees.map((employee) => employeeRepository.employeeExists(employee))
    );
    return allEmployeesExist.every((exist) => exist);
}

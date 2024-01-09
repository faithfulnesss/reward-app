const employeesService = require("../../../database/repositories/employeeRepository");
const errorView = require("../../views/errorView");
const recognitionsService = require("../../../database/repositories/recognitionRepository");
const { getChannelMembers } = require("../../utils/syncMembers");

module.exports = (app) => {
  app.view("give_recognition_submit", async ({ ack, body, view, client }) => {
    await ack();

    const {
      amount_input: {
        amount: { value: points },
      },
      employees_input: {
        employees: { selected_users: employees },
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

    try {
      const balance = +view.private_metadata;

      if (!(await checkEmployeesExist(employees))) {
        return openErrorView(
          client,
          body.trigger_id,
          "Some of the employees you selected don't exist on the back-end!"
        );
      }

      if (employees.includes(body.user.id)) {
        return openErrorView(
          client,
          body.trigger_id,
          "You can't give yourself recognition!"
        );
      }

      if (employees.length * points > balance) {
        return openErrorView(
          client,
          body.trigger_id,
          "You don't have enough points to give that much recognition!"
        );
      }

      const result = await recognitionsService.createRecognitions(
        body.user.id,
        employees,
        points,
        value.value
      );

      if (result) {
        let text = `${employees
          .map((employee) => `<@${employee}>`)
          .join(" ")} ${message} ${value.text.text}`;

        if (url) {
          text += ` <${url}|⠀>`;
        }

        await client.chat.postMessage({
          channel: body.user.id,
          text: text,
          mrkdwn: true,
        });
      } else {
        openErrorView(client, body.trigger_id, "Something went wrong!");
      }
    } catch (error) {
      console.error("Error happened ", error);
      openErrorView(client, body.trigger_id, "Something went wrong!");
    }
  });
};

async function checkEmployeesExist(employees) {
  const allEmployeesExist = await Promise.all(
    employees.map((employee) => employeesService.employeeExists(employee))
  );
  return allEmployeesExist.every((exist) => exist);
}

async function openErrorView(client, trigger_id, errorMessage) {
  await client.views.open({
    trigger_id,
    view: errorView(errorMessage),
  });
}

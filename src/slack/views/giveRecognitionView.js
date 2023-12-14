const values = [
  ["trust", "Trust"],
  ["excel", "Excel"],
  ["team-up", "Team Up"],
  ["follow-the-data", "Follow the Data"],
  ["innovate", "Innovate"],
  ["deliver-results", "Deliver Results"],
  ["be-passionate", "Be Passionate"],
  ["unleash-your-ambitions", "Unleash your Ambitions"],
];

module.exports = (balance) => {
  return {
    type: "modal",
    callback_id: "give_recognition_submit",
    private_metadata: balance.toString(),
    title: {
      type: "plain_text",
      text: "Give a bonus",
    },
    close: {
      type: "plain_text",
      text: "Close",
    },
    submit: {
      type: "plain_text",
      text: "Submit",
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Never let great work go unrecognized! :sparkles::trophy:",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Current balance:* ${balance} points`,
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "amount_input",
        element: {
          type: "number_input",
          is_decimal_allowed: false,
          min_value: "0",
          max_value: `${balance}`,
          action_id: "amount",
          placeholder: {
            type: "plain_text",
            text: "Enter the bonus amount",
          },
        },
        label: {
          type: "plain_text",
          text: "Amount",
        },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "employees_input",
        element: {
          type: "multi_users_select",
          action_id: "employees",
          placeholder: {
            type: "plain_text",
            text: "Select an employee",
          },
        },
        label: {
          type: "plain_text",
          text: "Recipient",
        },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "message_input",
        element: {
          type: "plain_text_input",
          action_id: "message",
          multiline: true,
          placeholder: {
            type: "plain_text",
            text: "Write a message",
          },
        },
        label: {
          type: "plain_text",
          text: "Message",
        },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "value_input",
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select hashtags",
            emoji: true,
          },
          options: values.map((value) => {
            return {
              text: {
                type: "plain_text",
                text: `#${value[0]}`,
                emoji: true,
              },
              value: `${value[1]}`,
            };
          }),
          action_id: "multi_static_select-action",
        },
        label: {
          type: "plain_text",
          text: "Hashtags",
          emoji: true,
        },
        optional: false,
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "url_input",
        element: {
          type: "url_text_input",
          action_id: "url_text_input-action",
        },
        label: {
          type: "plain_text",
          text: "GIF or image URL",
          emoji: true,
        },
        optional: true,
      },
      {
        type: "divider",
      },
    ],
  };
};

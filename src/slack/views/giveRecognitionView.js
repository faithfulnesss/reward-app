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
            text: "Give kudos",
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
                    text: "Always make sure that great work is recognized :clap: :sparkles:",
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
                        text: `*Current balance:* ${balance} stars`,
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
                    text: ":1234: Amount",
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
                        text: "Press on a username in the drop-down to select a name.",
                    },
                },
                label: {
                    type: "plain_text",
                    text: ":bust_in_silhouette: Recipient",
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
                        text: "Let your colleagues know how great their work is!",
                    },
                },
                label: {
                    type: "plain_text",
                    text: ":lower_left_ballpoint_pen: Message",
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
                        text: "Select a value",
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
                    text: ":obrio: Values",
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
                    text: ":awww: GIF or image URL",
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

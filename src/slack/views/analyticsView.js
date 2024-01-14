const createPaginatedView = require("./paginatedView");

const datePickerView = {
    type: "modal",
    callback_id: "fetch_analytics",
    title: {
        type: "plain_text",
        text: "Obrio Rewards App",
    },
    submit: {
        type: "plain_text",
        text: "Submit",
        emoji: true,
    },
    blocks: [
        {
            type: "input",
            block_id: "startDate",
            label: {
                type: "plain_text",
                text: "Start Date",
            },
            element: {
                type: "datepicker",
                action_id: "startDatePicker",
                initial_date: `${new Date().toISOString().substring(0, 10)}`,
                placeholder: {
                    type: "plain_text",
                    text: "Select a date",
                },
            },
        },
        {
            type: "input",
            block_id: "endDate",
            label: {
                type: "plain_text",
                text: "End Date",
            },
            element: {
                type: "datepicker",
                action_id: "endDatePicker",
                initial_date: `${new Date().toISOString().substring(0, 10)}`,
                placeholder: {
                    type: "plain_text",
                    text: "Select a date",
                },
            },
        },
    ],
};

const analyticsView = (data, privateMetadata) => {
    return {
        type: "modal",
        title: {
            type: "plain_text",
            text: "Obrio Rewards App",
            emoji: true,
        },
        close: {
            type: "plain_text",
            text: "Close",
            emoji: true,
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `📅 *${data.startDate}* - *${data.endDate}*`,
                },
            },
            {
                type: "divider",
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Kudos Sent* - ${data.kudosSent}`,
                },
                accessory: {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "View",
                    },
                    style: "primary",
                    value: "dummy_value",
                    action_id: "open_recognitions_list",
                },
            },
            {
                type: "divider",
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*% of Employees Recognized* - ${data.employeesRecognized.toFixed(
                        0
                    )}%`,
                },
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*% of All Employees Giving Recognition* - ${data.percEmpRecognizeGiven.toFixed(
                        0
                    )}%`,
                },
            },
            {
                type: "divider",
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*% of Managers Giving Recognition* - ${data.percMngrRecognizeGiven.toFixed(
                        0
                    )}%`,
                },
                accessory: {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "View",
                    },
                    style: "primary",
                    value: "click_me_123",
                    action_id: "button-action",
                },
            },
            {
                type: "divider",
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*Kudos by Value*",
                },
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `${
                            data.recognitionsDistribution &&
                            data.recognitionsDistribution.length > 0
                                ? data.recognitionsDistribution
                                      .map(
                                          (item) =>
                                              `${
                                                  item.value
                                              } - ${item.percentage.toFixed(
                                                  0
                                              )}%\n`
                                      )
                                      .join("")
                                : "N/A"
                        }`,
                    },
                ],
            },
            {
                type: "divider",
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*Haven't Received Recognition* - 50",
                },
                accessory: {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "View",
                    },
                    style: "primary",
                    value: "click_me_123",
                    action_id: "button-action",
                },
            },
            {
                type: "divider",
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*Activities Completed* - 50",
                },
                accessory: {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "View",
                    },
                    style: "primary",
                    value: "click_me_123",
                    action_id: "button-action",
                },
            },
            {
                type: "divider",
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Rewards Requested* - ${data.rewardRequestsCount}`,
                },
                accessory:
                    data?.rewardRequestsCount > 0
                        ? {
                              type: "button",
                              text: {
                                  type: "plain_text",
                                  text: "View",
                              },
                              style: "primary",
                              value: "click_me_123",
                              action_id: "button-action",
                          }
                        : undefined,
            },
            {
                type: "divider",
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*Top 5 performed activities*",
                },
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `${
                            data.awardRequestsPopularity &&
                            data.awardRequestsPopularity.length > 0
                                ? data.awardRequestsPopularity
                                      .map(
                                          (item) =>
                                              `${
                                                  item.name
                                              } - ${item.percentage.toFixed(
                                                  0
                                              )}%\n`
                                      )
                                      .join("")
                                : "N/A"
                        }`,
                    },
                ],
            },
            {
                type: "divider",
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*Total stars accumulated by each team*",
                },
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `${
                            data.balanceDistribution &&
                            data.balanceDistribution.length > 0
                                ? data.balanceDistribution
                                      .map(
                                          (item) =>
                                              `${
                                                  item.team
                                              } - ${item.percentage.toFixed(
                                                  0
                                              )}%\n`
                                      )
                                      .join("")
                                : "N/A"
                        }`,
                    },
                ],
            },
            {
                type: "divider",
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*Completed activities per each domain*",
                },
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `${
                            data.awardRequestsDistribution &&
                            data.awardRequestsDistribution.length > 0
                                ? data.awardRequestsDistribution
                                      .map(
                                          (item) =>
                                              `${
                                                  item.type
                                              } - ${item.percentage.toFixed(
                                                  0
                                              )}%\n`
                                      )
                                      .join("")
                                : "N/A"
                        }`,
                    },
                ],
            },
            {
                type: "divider",
            },
        ],
        private_metadata: JSON.stringify(privateMetadata) ?? "",
    };
};

const renderRecognitionItem = (item, index, currentPage, pageSize) => {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: `*${index + 1 + (currentPage - 1) * pageSize}.* _${
                item.SenderName
            }_ recognized _${item.ReceiverName}_ with *${
                item.Points
            }* :star: on ${item.CreatedAt.toString().slice(0, 10)}`,
        },
    };
};

const recognitionsListView = (recognitions, currentPage) => {
    return createPaginatedView(
        recognitions,
        currentPage,
        10,
        renderRecognitionItem,
        "Recognitions",
        "recognitions"
    );
};

module.exports = { datePickerView, analyticsView, recognitionsListView };

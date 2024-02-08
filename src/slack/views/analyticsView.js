const { createPaginatedView } = require("./paginatedView");

const datePickerView = {
    type: "modal",
    callback_id: "fetch_analytics",
    title: {
        type: "plain_text",
        text: "Analytics",
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
            text: "Analytics",
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
                accessory:
                    data?.kudosSent > 0
                        ? {
                              type: "button",
                              text: {
                                  type: "plain_text",
                                  text: "View",
                              },
                              style: "primary",
                              value: "dummy_value",
                              action_id: "open_recognitions_list",
                          }
                        : undefined,
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `Detailed breakdown of kudos *sent & received* by each employee`,
                },
                accessory:
                    data?.kudosSent > 0
                        ? {
                              type: "button",
                              text: {
                                  type: "plain_text",
                                  text: "View",
                              },
                              style: "primary",
                              value: "dummy_value",
                              action_id: "open_recognitions_by_employee",
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
                    text: `*% of Employees Recognized* - ${data.employeesRecognized.toFixed(
                        1
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
                    text: `*% of All Employees Giving Recognition* - ${data.percEmpRecognizeGiven.toFixed(
                        1
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
                    text: `*% of Managers Giving Kudos* - ${data.percMngrRecognizeGiven.toFixed(
                        1
                    )}%`,
                },

                accessory:
                    data?.percMngrRecognizeGiven > 0
                        ? {
                              type: "button",
                              text: {
                                  type: "plain_text",
                                  text: "View",
                              },
                              style: "primary",
                              value: "dummy_value",
                              action_id: "open_managers_list",
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
                                                  1
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
                    text: `*Haven't Received Kudos* - ${data.unrecognizedCount}`,
                },
                accessory:
                    data?.unrecognizedCount > 0
                        ? {
                              type: "button",
                              text: {
                                  type: "plain_text",
                                  text: "View",
                              },
                              style: "primary",
                              value: "dummy_value",
                              action_id: "open_unrecognized_list",
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
                    text: `*Activities Completed* - ${data.awardRequestsCount}`,
                },
                accessory:
                    data?.awardRequestsCount > 0
                        ? {
                              type: "button",
                              text: {
                                  type: "plain_text",
                                  text: "View",
                              },
                              style: "primary",
                              value: "dummy_value",
                              action_id: "open_activities_list",
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
                              value: "dummy_value",
                              action_id: "open_rewards_list",
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
                                                  1
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
                                                  1
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
                                                  1
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
                item.Name
            }_ - Received *_${item.Received}_* time(s) - Gave *_${
                item.Given
            }_* time(s)`,
        },
    };
};

const recognitionsListView = (recognitions, currentPage) => {
    return createPaginatedView(
        recognitions,
        currentPage,
        10,
        renderRecognitionItem,
        "Kudos Sent",
        "recognitions"
    );
};

const renderRewardRequestItem = (item, index, currentPage, pageSize) => {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: `*${index + 1 + (currentPage - 1) * pageSize}.* _${
                item.EmployeeName
            }_ requested *${
                item.RewardName
            }* on ${item.CreatedAt.toString().slice(0, 10)}`,
        },
    };
};

const rewardRequestsListView = (rewardRequests, currentPage) => {
    return createPaginatedView(
        rewardRequests,
        currentPage,
        10,
        renderRewardRequestItem,
        "Reward Requests",
        "rewards"
    );
};

const renderAwardRequestItem = (item, index, currentPage, pageSize) => {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: `*${index + 1 + (currentPage - 1) * pageSize}.* _${
                item.EmployeeName
            }_ requested *${
                item.AwardName
            }* on ${item.CreatedAt.toISOString().slice(0, 10)}`,
        },
    };
};

const awardRequestsListView = (awardRequests, currentPage) => {
    return createPaginatedView(
        awardRequests,
        currentPage,
        10,
        renderAwardRequestItem,
        "Activities Completed",
        "activities"
    );
};

const renderManagerItem = (item, index, currentPage, pageSize) => {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: `*${index + 1 + (currentPage - 1) * pageSize}.* _${
                item.Name
            }_ gave kudos *${
                item.recognitionCount
            }* times with total count of ${item.totalPoints} :star:`,
        },
    };
};

const managersListView = (managersList, currentPage) => {
    return createPaginatedView(
        managersList,
        currentPage,
        10,
        renderManagerItem,
        "Managers Giving Kudos",
        "managers"
    );
};

const renderUnrecognizedItem = (item, index, currentPage, pageSize) => {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: `*${index + 1 + (currentPage - 1) * pageSize}.* _${
                item.Name
            }_ from ${item.Team} didn't receive any kudos`,
        },
    };
};

const unrecognizedListView = (unrecognizedList, currentPage) => {
    return createPaginatedView(
        unrecognizedList,
        currentPage,
        10,
        renderUnrecognizedItem,
        "Haven't Received Kudos",
        "unrecognized"
    );
};

const recognitionsByManagers = (
    managers,
    selected_manager,
    recognitions_by_manager
) => {
    const recognitionsBlocks = [];

    if (recognitions_by_manager && recognitions_by_manager.length > 0) {
        for (const recognition of recognitions_by_manager) {
            recognitionsBlocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*${recognition.SenderName}* gave ${
                        recognition.Points
                    }:star: to *${
                        recognition.ReceiverName
                    }* on ${recognition.Date.toISOString().slice(0, 10)}`,
                },
            });
        }
    } else {
        recognitionsBlocks.push(
            { type: "divider" },
            {
                type: "section",
                text: { type: "mrkdwn", text: "Select the manager" },
            }
        );
    }

    return {
        type: "modal",
        title: {
            type: "plain_text",
            text: "Managers Giving Kudos",
        },
        blocks: [
            {
                type: "actions",
                block_id: "manager_selector",
                elements: [
                    {
                        type: "static_select",
                        placeholder: {
                            type: "plain_text",
                            text: "Select a manager",
                        },
                        options: managers.map((manager) => {
                            return {
                                text: {
                                    type: "plain_text",
                                    text: manager.Name,
                                },
                                value: manager.Name,
                            };
                        }),
                        initial_option: selected_manager
                            ? selected_manager
                            : undefined,
                        action_id: "manager_selected",
                    },
                ],
            },
            ...recognitionsBlocks,
        ],
    };
};

const recognitionsByEmployee = (
    employees,
    selected_employee,
    recognitions_by_employee
) => {
    const recognitionsBlocks = [];

    if (recognitions_by_employee && recognitions_by_employee.length > 0) {
        for (const recognition of recognitions_by_employee) {
            recognitionsBlocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*${recognition.SenderName}* gave ${
                        recognition.Points
                    }:star: to *${
                        recognition.ReceiverName
                    }* on ${recognition.Date.toISOString().slice(0, 10)}`,
                },
            });
        }
    } else {
        recognitionsBlocks.push(
            { type: "divider" },
            {
                type: "section",
                text: { type: "mrkdwn", text: "Select the employee" },
            }
        );
    }

    return {
        type: "modal",
        title: {
            type: "plain_text",
            text: "Kudos Sent",
        },
        blocks: [
            {
                type: "actions",
                block_id: "employee_selector",
                elements: [
                    {
                        type: "static_select",
                        placeholder: {
                            type: "plain_text",
                            text: "Select an employee",
                        },
                        options: employees.map((employee) => {
                            return {
                                text: {
                                    type: "plain_text",
                                    text: employee.Name,
                                },
                                value: employee.Name,
                            };
                        }),
                        initial_option: selected_employee
                            ? selected_employee
                            : undefined,
                        action_id: "employee_selected",
                    },
                ],
            },
            ...recognitionsBlocks,
        ],
    };
};

const awardRequestsByType = (
    awardRequests,
    selectedType,
    awardRequestsByType
) => {
    const awardRequestsBlocks = [];

    if (awardRequestsByType && awardRequestsByType.length > 0) {
        for (const awardRequest of awardRequestsByType) {
            awardRequestsBlocks.push(
                { type: "divider" },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `_${awardRequest.EmployeeName}_ completed *${
                            awardRequest.AwardName
                        }* on ${awardRequest.CreatedAt.toISOString().slice(
                            0,
                            10
                        )}`,
                    },
                }
            );
        }
    } else {
        awardRequestsBlocks.push({
            type: "section",
            text: { type: "mrkdwn", text: "Select the domain of activity" },
        });
    }

    return {
        type: "modal",
        title: {
            type: "plain_text",
            text: "Activities Completed",
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `${awardRequests
                        .map((request) => {
                            return `*${request.Type}* - _${request.Count}_`;
                        })
                        .join(" | ")}`,
                },
            },
            {
                type: "actions",
                block_id: "award_type_selector",
                elements: [
                    {
                        type: "static_select",
                        placeholder: {
                            type: "plain_text",
                            text: "Select the domain of activity",
                        },
                        options: awardRequests.map((request) => {
                            return {
                                text: {
                                    type: "plain_text",
                                    text: request.Type,
                                },
                                value: request.Type,
                            };
                        }),
                        initial_option: selectedType ? selectedType : undefined,
                        action_id: "award_type_selected",
                    },
                ],
            },
            ...awardRequestsBlocks,
        ],
    };
};

const unrecognizedByTeam = (teams, selectedTeam, undrecognizedByTeam) => {
    const unrecognizedBlocks = [];

    if (undrecognizedByTeam && undrecognizedByTeam.length > 0) {
        for (const employee of undrecognizedByTeam) {
            unrecognizedBlocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*${employee.Name}* hasn't been recognized`,
                },
            });
        }
    } else {
        unrecognizedBlocks.push(
            { type: "divider" },
            {
                type: "section",
                text: { type: "mrkdwn", text: "Select the team" },
            }
        );
    }

    return {
        type: "modal",
        title: {
            type: "plain_text",
            text: "Haven't Received Kudos",
        },
        blocks: [
            {
                type: "actions",
                block_id: "unrecognized_team_selector",
                elements: [
                    {
                        type: "static_select",
                        placeholder: {
                            type: "plain_text",
                            text: "Select the domain of activity",
                        },
                        options: teams.map((team) => {
                            return {
                                text: {
                                    type: "plain_text",
                                    text: team.Name,
                                },
                                value: team.Name,
                            };
                        }),
                        initial_option: selectedTeam ? selectedTeam : undefined,
                        action_id: "unrecognized_team_selected",
                    },
                ],
            },
            ...unrecognizedBlocks,
        ],
    };
};

module.exports = {
    datePickerView,
    analyticsView,
    recognitionsListView,
    rewardRequestsListView,
    awardRequestsListView,
    managersListView,
    unrecognizedListView,
    recognitionsByManagers,
    recognitionsByEmployee,
    awardRequestsByType,
    unrecognizedByTeam,
};

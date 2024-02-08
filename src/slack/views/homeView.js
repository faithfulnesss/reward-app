module.exports = (role) => {
    const blocks = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*Express your gratitude* to colleagues by recognizing their contributions, *claim awards* for completed tasks by highlighting your achievements and *get rewards* for outstanding results :obrio:",
            },
        },
        {
            type: "divider",
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*:star: Give kudos*\n\nDon't delay, recognize your coworkers right away!",
            },
            accessory: {
                type: "button",
                text: {
                    type: "plain_text",
                    text: "Give kudos",
                },
                style: "primary",
                action_id: "click_give_recognition",
            },
        },
        {
            type: "divider",
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*:trophy: Claim an award*\n\nIf you've completed the activity, make sure you get recognized for it.",
            },
            accessory: {
                type: "button",
                text: {
                    type: "plain_text",
                    text: "Claim an award",
                },
                style: "primary",
                action_id: "click_claim_award",
            },
        },
        {
            type: "divider",
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*:gift: Pick a reward*\n\nReward yourself with a well-deserved gift.",
            },
            accessory: {
                type: "button",
                text: {
                    type: "plain_text",
                    text: "Pick a reward",
                },
                style: "primary",
                action_id: "click_pick_reward",
            },
        },
        {
            type: "divider",
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*Balance*\n\nCheck the current balance",
            },
            accessory: {
                type: "button",
                text: {
                    type: "plain_text",
                    text: "Balance",
                },
                style: "primary",
                action_id: "click_check_balance",
            },
        },
        {
            type: "divider",
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*Leaderboard*\n\nCheck who the most recognizable teammate is.",
            },
            accessory: {
                type: "button",
                text: {
                    type: "plain_text",
                    text: "Leaderboard",
                },
                style: "primary",
                action_id: "open_leaderboard",
            },
        },
        {
            type: "divider",
        },
    ];

    if (role === "HR") {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*Analytics*\n\nCheck the analytics of the app.",
            },
            accessory: {
                type: "button",
                text: {
                    type: "plain_text",
                    text: "View Analytics",
                },
                style: "primary",
                action_id: "check_analytics",
            },
        });
    }

    return {
        type: "home",
        blocks: blocks,
    };
};

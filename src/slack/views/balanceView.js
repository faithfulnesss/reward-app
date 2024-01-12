module.exports = (balance) => {
    return {
        type: "modal",
        title: {
            type: "plain_text",
            text: "Obrio Rewards App",
        },
        close: {
            type: "plain_text",
            text: "Close",
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `Your balance: ${balance} stars\n\nKeep up the great work, accumulate stars and take a reward!`,
                },
            },
        ],
    };
};

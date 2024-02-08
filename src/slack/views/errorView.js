module.exports = (errorMessage) => {
    return {
        type: "modal",
        title: {
            type: "plain_text",
            text: "Error",
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Error Occurred*\n\n${errorMessage}`,
                },
            },
        ],
        close: {
            type: "plain_text",
            text: "Close",
        },
    };
};

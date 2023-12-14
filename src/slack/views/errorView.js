module.exports = (errorMessage) => {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "OBRIO Rewards App",
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

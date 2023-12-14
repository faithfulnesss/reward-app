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
          text: `Your balance: ${balance} points\n\nRecognize your teammates for their great work or pick a rewards!`,
        },
      },
    ],
  };
};

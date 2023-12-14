module.exports = (rewards, balance) => {
  const view = {
    type: "modal",
    title: {
      type: "plain_text",
      text: "My App",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true,
    },
    blocks: [],
  };

  for (const reward of rewards) {
    view.blocks.push(
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${reward.Name}* - ${reward.Price} points\n${reward.Description}`,
        },
        accessory: reward.Image
          ? {
              type: "image",
              image_url: reward.Image,
              alt_text: reward.Name,
            }
          : undefined,
      },
      balance >= reward.Price
        ? {
            type: "actions",
            elements: [
              {
                type: "button",
                style: "primary",
                text: {
                  type: "plain_text",
                  text: "Pick",
                  emoji: true,
                },
                value: reward.Name,
                action_id: "click_pick_reward",
              },
            ],
          }
        : {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `*You need ${
                  reward.Price - balance
                } more points to pick this reward*`,
              },
            ],
          }
    );
  }
  return view;
};

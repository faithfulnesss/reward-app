module.exports = (rewards, balance) => {
    const view = {
        type: "modal",
        title: {
            type: "plain_text",
            text: "Rewards",
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
                    text: `*${reward.Name}* - *${reward.Points}* :star:\n${
                        reward.Description ? reward.Description : ""
                    }`,
                },
                accessory: reward.URL
                    ? {
                          type: "image",
                          image_url: reward.URL,
                          alt_text: reward.Name,
                      }
                    : undefined,
            },
            balance >= reward.Points
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
                              value: reward._id,
                              action_id: "pick_reward",
                          },
                      ],
                  }
                : {
                      type: "context",
                      elements: [
                          {
                              type: "mrkdwn",
                              text: `*You need ${
                                  reward.Points - balance
                              } more stars to pick this reward*`,
                          },
                      ],
                  }
        );
    }
    return view;
};

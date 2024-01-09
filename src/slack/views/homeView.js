module.exports = (role) => {
  return {
    type: "home",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Hiya! Bonusly makes it quick and easy for everyone at your organization to give recognition, claim awards, and get rewards. :green_heart:",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*:star2: Give recognition*\n\nDon't delay, recognize your coworkers right away!",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Give recognition",
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
          text: "*:trophy: Claim an award*\n\nIf you did the thing, make sure you get recognized for the thing.",
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
          text: "*:money_mouth_face: Pick a reward*\n\nGet yourself something nice, as a treat.",
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
          text: "*Balance*\n\nCheck my balance",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Check Balance",
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
          text: "*Leaderboard*\n\nCheck who is the most recognizable teammate",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "View Leaderboard",
          },
          style: "primary",
          action_id: "open_leaderboard",
        },
      },
      {
        type: "divider",
      },
      // {
      //   type: "section",
      //   text: {
      //     type: "mrkdwn",
      //     text: role === "HR" ? "*Admin*\n\nManage your employees" : " ",
      //   },
      // },
    ],
  };
};

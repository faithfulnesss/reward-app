module.exports = (categories, selected_category, awards_by_category) => {
  const awardBlocks = [];

  if (awards_by_category && awards_by_category.length > 0) {
    for (const award of awards_by_category) {
      awardBlocks.push(
        { type: "divider" },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${award.Name}* - ${award.Points} points\n${award.Details}`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              style: "primary",
              text: {
                type: "plain_text",
                text: "Apply for this award",
                emoji: true,
              },
              value: award._id,
              action_id: "claim_award",
            },
          ],
        }
      );
    }
  } else {
    awardBlocks.push(
      { type: "divider" },
      {
        type: "section",
        text: { type: "mrkdwn", text: "Select a category of awards" },
      }
    );
  }

  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Obrio Rewards App",
    },
    blocks: [
      {
        type: "actions",
        block_id: "category_selector",
        elements: [
          {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select a category",
            },
            options: categories.map((category) => {
              return {
                text: {
                  type: "plain_text",
                  text: category,
                },
                value: category,
              };
            }),
            initial_option: selected_category ? selected_category : undefined,
            action_id: "award_category_selected",
          },
        ],
      },
      ...awardBlocks,
    ],
  };
};

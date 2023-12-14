module.exports = () => {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Obrio Rewards App",
    },
    submit: {
      type: "plain_text",
      text: "Submit",
    },
    blocks: [
      {
        type: "actions",
        elements: [
          {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select a category",
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "HR & Business",
                },
                value: "HR & Business",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Talent Acquisition",
                },
                value: "Talent Acquisition",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Employer Brand",
                },
                value: "Employer Brand",
              },
            ],
            action_id: "award_category_selected",
          },
        ],
      },
    ],
  };
};

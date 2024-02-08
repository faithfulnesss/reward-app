const {
    rewardRepository,
    employeeRepository,
    rewardRequestRepository,
} = require("../../../database/repositories");
const pickRewardView = require("../../views/pickRewardView");
const openErrorView = require("./openErrorView");
const logger = require("../../../utils/logger");

module.exports = (app) => {
    app.action("click_pick_reward", async ({ ack, body, client }) => {
        await ack();
        try {
            const balance = (
                await employeeRepository.getEmployee({ SlackID: body.user.id })
            ).Balance;

            const rewards = await rewardRepository.getRewardsSortedByPoints();

            await client.views.open({
                trigger_id: body.trigger_id,
                view: pickRewardView(rewards, balance),
            });
        } catch (error) {
            logger.error(error);
            await openErrorView(client, body.trigger_id);
        }
    });

    app.action("pick_reward", async ({ ack, body, client }) => {
        await ack();

        const reward_id = body.actions[0].value;

        try {
            const rewardRequest =
                await rewardRequestRepository.createRewardRequest(
                    body.user.id,
                    reward_id
                );

            if (rewardRequest) {
                await client.views.update({
                    view_id: body.view.id,
                    view: sucessView,
                });
            } else {
                await openErrorView(client, body.trigger_id);
            }
        } catch (error) {
            logger.error(error);
            await openErrorView(client, body.trigger_id);
        }
    });
};

const sucessView = {
    type: "modal",
    title: {
        type: "plain_text",
        text: "Rewards",
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
                text: "Your request has been submitted! You will get your stars as soon as your request is approved.",
            },
        },
    ],
};

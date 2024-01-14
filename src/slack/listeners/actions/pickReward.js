const pickRewardView = require("../../views/pickRewardView");
const rewardRequestRepository = require("../../../database/repositories/rewardRequestRepository");
const rewardsRepository = require("../../../database/repositories/rewardRepository");
const employeesService = require("../../../database/repositories/employeeRepository");

module.exports = (app) => {
    app.action("click_pick_reward", async ({ ack, body, client }) => {
        await ack();
        try {
            const balance = (
                await employeesService.getEmployee({ SlackID: body.user.id })
            ).Balance;

            const rewards = await rewardsRepository.getRewards();
            await client.views.open({
                trigger_id: body.trigger_id,
                view: pickRewardView(rewards, balance),
            });
        } catch (error) {
            console.error(error);
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
                await client.views.update({
                    view_id: body.view.id,
                    view: errorView("Something went wrong!"),
                });
            }
        } catch (error) {
            console.error(error);
            await client.views.open({
                trigger_id: body.trigger_id,
                view: errorView("Something went wrong!"),
            });
        }
    });
};

const sucessView = {
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
                text: "Your request has been submitted! You will get your stars as soon as your request is approved.",
            },
        },
    ],
};

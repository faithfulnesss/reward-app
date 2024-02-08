const claimAwardView = require("../../views/claimAwardView");
const openErrorView = require("./openErrorView");
const {
    awardRepository,
    awardRequestRepository,
} = require("../../../database/repositories");
const logger = require("../../../utils/logger");

module.exports = (app) => {
    app.action("click_claim_award", async ({ ack, body, client }) => {
        try {
            await ack();

            const categories = await awardRepository.getCategories();

            await client.views.open({
                trigger_id: body.trigger_id,
                view: claimAwardView(categories),
            });
        } catch (error) {
            logger.error(error);

            await openErrorView(client, body.trigger_id);
        }
    });

    app.action("award_category_selected", async ({ ack, body, client }) => {
        try {
            await ack();

            const categories = body.view.blocks[0].elements[0].options.map(
                (option) => {
                    return option.value;
                }
            );

            const selected_category =
                body.view.state.values.category_selector.award_category_selected
                    .selected_option;

            const awards_by_category = await awardRepository.getAwards({
                Type: selected_category.value,
            });

            await client.views.update({
                view_id: body.view.id,
                view: claimAwardView(
                    categories,
                    selected_category,
                    awards_by_category
                ),
            });
        } catch (error) {
            logger.error(error);

            await openErrorView(client, body.trigger_id);
        }
    });

    app.action("claim_award", async ({ ack, body, client }) => {
        await ack();

        const awardId = body.actions[0].value;

        try {
            const awardRequest =
                await awardRequestRepository.createAwardRequest(
                    body.user.id,
                    awardId
                );

            if (awardRequest) {
                await client.views.update({
                    view_id: body.view.id,
                    view: successView,
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

const successView = {
    type: "modal",
    title: {
        type: "plain_text",
        text: "Success",
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

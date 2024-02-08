const openErrorView = require("../listeners/actions/openErrorView");
const logger = require("../../utils/logger");

const paginate = (array, pageSize, pageNumber) => {
    const startIndex = (pageNumber - 1) * pageSize;
    return array.slice(startIndex, startIndex + pageSize);
};

const createPaginatedBlocks = (
    items,
    currentPage,
    pageSize,
    renderFunction
) => {
    const paginatedItems = paginate(items, pageSize, currentPage);
    return paginatedItems.map((item, index) =>
        renderFunction(item, index, currentPage, pageSize)
    );
};

const createPaginationButtons = (totalPages, currentPage, actionIdPrefix) => {
    const buttons = [];
    if (currentPage > 1) {
        buttons.push({
            type: "button",
            text: { type: "plain_text", text: "Previous" },
            action_id: `${actionIdPrefix}_previous`,
            value: String(currentPage - 1),
        });
    }
    if (currentPage < totalPages) {
        buttons.push({
            type: "button",
            text: { type: "plain_text", text: "Next" },
            action_id: `${actionIdPrefix}_next`,
            value: String(currentPage + 1),
        });
    }
    return buttons;
};

const createPaginatedView = (
    items,
    currentPage,
    pageSize,
    renderFunction,
    titleText,
    actionIdPrefix
) => {
    const totalPages = Math.ceil(items.length / pageSize);
    const blocks = createPaginatedBlocks(
        items,
        currentPage,
        pageSize,
        renderFunction
    );
    const buttons = createPaginationButtons(
        totalPages,
        currentPage,
        actionIdPrefix
    );

    if (buttons.length > 0) {
        blocks.push({
            type: "actions",
            elements: buttons,
        });
    }

    return {
        type: "modal",
        title: { type: "plain_text", text: titleText },
        blocks: blocks,
    };
};

const buildPaginatedView = (
    app,
    rootAction,
    nextAction,
    prevAction,
    dataFactory,
    viewFactory
) => {
    let data;

    app.action(rootAction, async ({ ack, body, client }) => {
        try {
            await ack();

            const { startDate, endDate } = JSON.parse(
                body.view.private_metadata
            );

            data = await dataFactory(new Date(startDate), new Date(endDate));

            await client.views.push({
                trigger_id: body.trigger_id,
                view: viewFactory(data, 1),
            });
        } catch (error) {
            logger.error(error);
            await openErrorView(client, body.trigger_id);
        }
    });

    app.action(nextAction, async ({ ack, body, client, action }) => {
        try {
            await ack();

            const currentPage = parseInt(action.value);

            await client.views.update({
                view_id: body.view.id,
                view: viewFactory(data, currentPage),
            });
        } catch (error) {
            logger.error(error);
            await openErrorView(client, body.trigger_id);
        }
    });

    app.action(prevAction, async ({ ack, body, client, action }) => {
        try {
            await ack();

            const currentPage = parseInt(action.value);

            await client.views.update({
                view_id: body.view.id,
                view: viewFactory(data, currentPage),
            });
        } catch (error) {
            logger.error(error);
            await openErrorView(client, body.trigger_id);
        }
    });
};

const buildSelectiveView = (
    app,
    openAction,
    selectedAction,
    openDataFactory,
    selectedDataFactory,
    selector,
    viewFactory
) => {
    let startDate, endDate;

    let data;

    app.action(openAction, async ({ ack, body, client }) => {
        try {
            await ack();

            ({ startDate, endDate } = JSON.parse(body.view.private_metadata));

            data = await openDataFactory(
                new Date(startDate),
                new Date(endDate)
            );
            await client.views.push({
                trigger_id: body.trigger_id,
                view: viewFactory(data),
            });
        } catch (error) {
            logger.error(error);
            await openErrorView(client, body.trigger_id);
        }

        app.action(selectedAction, async ({ ack, body, client }) => {
            try {
                await ack();

                const selected_option = selector(body.view.state.values);

                const records_by_option = await selectedDataFactory(
                    new Date(startDate),
                    new Date(endDate),
                    selected_option.value
                );

                await client.views.update({
                    view_id: body.view.id,
                    view: viewFactory(data, selected_option, records_by_option),
                });
            } catch (error) {
                logger.error(error);

                await openErrorView(client, body.trigger_id);
            }
        });
    });
};
module.exports = {
    createPaginatedView,
    buildPaginatedView,
    buildSelectiveView,
};

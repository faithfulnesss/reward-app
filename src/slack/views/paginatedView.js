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

module.exports = createPaginatedView;

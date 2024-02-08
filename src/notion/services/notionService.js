const notion = require("../client");
const logger = require("../../utils/logger");

async function getNotionRecords(databaseId, filter) {
    let records = [];
    let hasNextPage = null;
    let startCursor = undefined;

    try {
        do {
            const response = await notion.databases.query({
                database_id: databaseId,
                start_cursor: startCursor,
                page_size: 100,
                filter: filter ? filter : undefined,
            });

            records.push(...response.results);

            hasNextPage = response.has_more;
            startCursor = response.next_cursor;
        } while (hasNextPage);

        return records;
    } catch (error) {
        logger.error(`Failed to get records from Notion: ${error}`);
    }

    return records;
}

async function createNotionRecord(databaseId, properties) {
    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: properties,
        });
    } catch (error) {
        logger.error(`Error creating record: ${error}`);
    }
}

module.exports = {
    getNotionRecords,
    createNotionRecord,
};

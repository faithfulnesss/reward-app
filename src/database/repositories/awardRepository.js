const Award = require("../models/Award");

const createAward = async (award) => {
    try {
        const createdAward = await Award.create(award);
        return createdAward;
    } catch (error) {
        console.error(error);
    }
};

const getAward = async (filter) => {
    try {
        const award = await Award.findOne(filter || {});
        return award;
    } catch (error) {
        console.error(error);
    }
};

const getAwards = async (filter) => {
    try {
        const awards = await Award.find(filter || { isDeleted: false });
        return awards;
    } catch (error) {
        console.error(error);
    }
};

const getCategories = async () => {
    try {
        const categories = await Award.distinct("Type", { isDeleted: false });
        return categories;
    } catch (error) {
        console.error(error);
    }
};

const updateAward = async (awardId, update) => {
    try {
        const award = await Award.findOneAndUpdate(
            { _id: awardId },
            { ...update }
        );
        return award;
    } catch (error) {
        console.error(error);
    }
};

const softDeleteAward = async (awardId) => {
    try {
        const award = await Award.findOneAndUpdate(
            { _id: awardId },
            { isDeleted: true }
        );
        return award;
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getAward,
    getAwards,
    // getAwardsByCategory,
    // getAwardByName,
    createAward,
    updateAward,
    getCategories,
    softDeleteAward,
};

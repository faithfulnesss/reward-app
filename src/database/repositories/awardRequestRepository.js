const AwardRequest = require("../models/AwardRequest");
const awardRepository = require("./awardRepository");
const employeeRepository = require("./employeeRepository");

const createAwardRequest = async (employeeId, awardId) => {
    try {
        const award = await awardRepository.getAward({ _id: awardId });
        const employee = await employeeRepository.getEmployee({
            SlackID: employeeId,
        });

        const createdAwardRequest = await AwardRequest.create({
            Employee: employee._id,
            Award: award._id,
        });
        return createdAwardRequest;
    } catch (error) {
        console.error(error);
    }
};

const getAwardRequests = async (filter) => {
    try {
        const awardRequests = await AwardRequest.find(filter || {});
        return awardRequests;
    } catch (error) {
        console.error(error);
    }
};

const getAwardRequest = async (filter) => {
    try {
        const awardRequest = await AwardRequest.findOne(filter || {});
        return awardRequest;
    } catch (error) {
        console.error(error);
    }
};

const updateAwardRequest = async (awardRequestId, update) => {
    try {
        const updatedAwardRequest = await AwardRequest.findByIdAndUpdate(
            awardRequestId,
            update
        );
        return updatedAwardRequest;
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getAwardRequests,
    getAwardRequest,
    createAwardRequest,
    updateAwardRequest,
};

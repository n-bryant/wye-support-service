const moment = require("moment");
const { prisma } = require("../../generated/js/index");

/**
 * update job to completed/error status as appropriate
 * @param {String} jobId
 * @param {Array} errors
 */
const completeJob = async (jobId, errors) => {
  try {
    await prisma.updateJob({
      data: {
        completedTime: moment().format(),
        status: !errors.length ? "COMPLETE" : "ERROR"
      },
      where: {
        id: jobId
      }
    });
  } catch (e) {
    console.log("Error finishing job", e);
  }
};

module.exports = completeJob;

const moment = require("moment");
const { prisma } = require("../../generated/js/index");
const completeJob = require("./completeJob");

describe("completeJob", () => {
  beforeEach(() => {
    prisma.updateJob = jest.fn(() => Promise.resolve({}));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const jobId = "1";
  const emptyErrors = [];
  const errors = ["foo"];

  it("should update the provided job ID's record", async () => {
    await completeJob(jobId, emptyErrors);
    expect(prisma.updateJob).toHaveBeenCalled();
    expect(prisma.updateJob.mock.calls[0][0].where.id).toBe(jobId);
  });

  it("should set the completed job time to the current time", async () => {
    await completeJob(jobId, emptyErrors);
    expect(prisma.updateJob.mock.calls[0][0].data.completedTime).toBe(
      moment().format()
    );
  });

  it("should set the job status to COMPLETE if there are no errors", async () => {
    await completeJob(jobId, emptyErrors);
    expect(prisma.updateJob.mock.calls[0][0].data.status).toBe("COMPLETE");
  });

  it("should set the job status to ERROR if there are no errors", async () => {
    await completeJob(jobId, errors);
    expect(prisma.updateJob.mock.calls[0][0].data.status).toBe("ERROR");
  });
});

const moment = require("moment");
const { prisma } = require("../../generated/js/index");
const createJob = require("./createJob");

describe("createJob", () => {
  const job = { id: "1", createdTime: moment().format(), status: "RUNNING" };
  beforeEach(() => {
    prisma.createJob = jest.fn(() => Promise.resolve(job));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a job record with a created time and a status of RUNNING", async () => {
    const result = await createJob();
    expect(prisma.createJob).toHaveBeenCalled();
    expect(prisma.createJob.mock.calls[0][0].createdTime).toBe(
      moment().format()
    );
    expect(prisma.createJob.mock.calls[0][0].status).toBe("RUNNING");
    expect(result).toEqual(job);
  });
});

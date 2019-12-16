const supertest = require("supertest");
const app = require("./app");
const request = supertest(app);
const { prisma } = require("./generated/js/index.js");

describe("app", () => {
  const mockResponse = [
    {
      appid: "1"
    },
    {
      appid: "2"
    },
    {
      appid: "3"
    }
  ];
  prisma.games = jest.fn(() => Promise.resolve(mockResponse));

  it("has a /games POST endpoint", async () => {
    const response = await request.post("/games");
    expect(response.status).toBe(200);
  });

  it("should have the /games endpoint call prsima's games method if game IDs are passed as a query param", async () => {
    const response = await request.post("/games").send({
      gameids: ["1", "2", "3"]
    });
    expect(response.status).toBe(200);
    expect(prisma.games).toHaveBeenCalledWith({
      where: {
        appid_in: ["1", "2", "3"]
      }
    });
    expect(response.body.games).toEqual(mockResponse);
  });

  it("should have the /games endpoint return an error if the call to prisma games fails", async () => {
    const mockErrorResponse = { error: "oops" };
    prisma.games = jest.fn(() => Promise.reject(mockErrorResponse));
    const response = await request.post("/games").send({
      gameids: ["1", "2", "3"]
    });
    expect(response.body.error).toEqual(mockErrorResponse);
  });

  it("should have the /games endpoint return an error if no gameids are provided", async () => {
    prisma.games = jest.fn(() => Promise.reject({}));
    const response = await request.post("/games");
    expect(response.body.error).toBeDefined();
  });
});

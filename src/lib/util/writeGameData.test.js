const { prisma } = require("../../generated/js/index");
const writeGameData = require("./writeGameData");

describe("writeGameData", () => {
  prisma.upsertGame = jest.fn();
  const data = { appid: 1, name: "mock game" };

  it("should write a game's data to the db if the data includes an appid value", async () => {
    await writeGameData({});
    expect(prisma.upsertGame).not.toHaveBeenCalled();

    await writeGameData(data);
    expect(prisma.upsertGame).toHaveBeenCalledWith({
      where: {
        appid: data.appid
      },
      update: {
        ...data
      },
      create: {
        ...data
      }
    });
  });
});

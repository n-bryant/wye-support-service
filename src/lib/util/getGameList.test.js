const mockAxios = require("axios");

const getGameList = require("./getGameList");
const constants = require("../constants");
const { STEAM_SPY_BASE_URL } = constants;

describe("getGameList", () => {
  const game = { appid: 1 };

  it("should return a list of games from steam spy's all endpoint", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          "1": game
        }
      })
    );
    const result = await getGameList();
    expect(mockAxios.get).toHaveBeenCalledWith(STEAM_SPY_BASE_URL, {
      params: {
        request: "all"
      }
    });
    expect(result).toEqual([game]);
  });

  it("should return an empty array if it's unable to retrieve a list of games from steam spy", async () => {
    mockAxios.get.mockImplementationOnce(() => Promise.reject("oops"));
    const result = await getGameList();
    expect(result).toEqual([]);
  });
});

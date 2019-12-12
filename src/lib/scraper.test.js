const mockAxios = require("axios");
const moment = require("moment");
const { prisma } = require("../generated/js/index");
const { gameReducer } = require("./util/gameReducer");
const constants = require("./constants");
const { STEAM_SPY_BASE_URL, MULTIPLAYER_TAGS, SLEEP_TIME } = constants;

const sleep = require("./util/sleep");
jest.mock("./util/sleep");

const mockGame = {
  appid: 123,
  name: "name",
  developer: "developer 1, developer 2",
  publisher: "publisher 1, publisher 2",
  genre: "genre 1, genre 2",
  tags: {
    Multiplayer: 123,
    tag2: 321
  },
  price: "100",
  discount: "0",
  initialprice: "100",
  positive: 300,
  negative: 50
};

describe("getGameList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const { getGameList } = jest.requireActual("./scraper");
  it("should use axios' get method to call to steam spy's all endpoint", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { key1: "foo", key2: "bar" }
      })
    );
    const gameList = await getGameList();
    expect(mockAxios.get).toHaveBeenCalledWith(STEAM_SPY_BASE_URL, {
      params: {
        request: "all"
      }
    });
    expect(gameList).toEqual(["key1", "key2"]);
  });

  it("should return an empty array if the call to steam spy fails", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({ error: "foo" })
    );
    const gameList = await getGameList();
    expect(gameList).toEqual([]);
  });
});

describe("getGameData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const { getGameData } = require("./scraper");
  const gameId = "123";

  it("should use axios' get method to call steam spy's appdetails endpoint to retrieve data for the given gameId", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: mockGame
      })
    );
    const gameData = await getGameData(gameId);
    expect(mockAxios.get).toHaveBeenCalledWith(STEAM_SPY_BASE_URL, {
      params: {
        request: "appdetails",
        appid: gameId
      }
    });
    expect(gameData).toEqual(gameReducer(mockGame));
  });

  it("should return an empty object if no game data was found for the gameId", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {}
      })
    );
    const gameData = await getGameData(gameId);
    expect(gameData).toEqual({});

    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        error: "oops"
      })
    );
    const gameDataOnError = await getGameData(gameId);
    expect(gameDataOnError).toEqual({});
  });
});

describe("getIsMultiplayerGame", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const { getIsMultiplayerGame } = require("./scraper");
  it("should return truthy if a given tags list has any matches in MULTIPLAYER_TAGS", () => {
    MULTIPLAYER_TAGS.forEach(tag => {
      const result = getIsMultiplayerGame([tag]);
      expect(result).toBeTruthy();
    });
  });

  it("should return falsy if a given tags list does not have any matches in MULTIPLAYER_TAGS", () => {
    const result = getIsMultiplayerGame(["Non-matching Tag"]);
    expect(result).toBeFalsy();
  });
});

describe("writeGameData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const { writeGameData } = require("./scraper");
  prisma.upsertGame = jest.fn(() => Promise.resolve({}));
  it("should call the prisma client's upsertGame method", async () => {
    const data = {
      appid: "123",
      foo: "bar"
    };
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

describe("runCron", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sleep.mockReset();
  });

  const { runCron } = require("./scraper");
  prisma.createJob = jest.fn(() => Promise.resolve({ id: "foo" }));
  prisma.upsertGame = jest.fn(() => Promise.resolve({}));
  prisma.updateJob = jest.fn(() => Promise.resolve({}));

  it("should create a new job", async () => {
    await runCron();
    expect(prisma.createJob).toHaveBeenCalledWith({
      createdTime: moment().format(),
      status: "RUNNING"
    });
  });

  it(`should sleep for ${SLEEP_TIME}ms every 3 and 5 iterations over gameList`, async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          key1: "foo",
          key2: "bar",
          key3: "fizz",
          key4: "buzz",
          key5: "fizz-buzz"
        } // call to getGameList
      })
    );
    await runCron();
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it("should write multiplayer games data to db", async () => {
    mockAxios.get
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: { key1: "foo", key2: "bar" } // call to getGameList
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: mockGame // multiplayer game
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            ...mockGame,
            tags: {
              notMultiplayer: 1231
            }
          } // non-multiplayer game
        })
      );

    await runCron();
    expect(prisma.upsertGame).toHaveBeenCalledTimes(1);
  });

  it("should write the job completion time to the db when finished", async () => {
    mockAxios.get
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: { key1: "foo", key2: "bar" } // call to getGameList
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: mockGame // multiplayer game
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            ...mockGame,
            tags: {
              notMultiplayer: 1231
            }
          } // non-multiplayer game
        })
      );

    await runCron();
    expect(prisma.updateJob).toHaveBeenCalledWith({
      data: {
        completedTime: moment().format(),
        status: "COMPLETE"
      },
      where: {
        id: "foo"
      }
    });
  });

  it("should set the job status to ERROR if no games data was available", async () => {
    await runCron();
    expect(prisma.updateJob).toHaveBeenCalledWith({
      data: {
        completedTime: moment().format(),
        status: "ERROR"
      },
      where: {
        id: "foo"
      }
    });
  });

  it("should not update the job on completion if no job record was created", async () => {
    prisma.createJob = jest.fn(() => Promise.reject({ error: "foo" }));
    await runCron();
    expect(prisma.updateJob).not.toHaveBeenCalled();
  });
});

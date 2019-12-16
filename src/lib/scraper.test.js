const { gameReducer } = require("./util/gameReducer");
const constants = require("./constants");
const { STEAM_SPY_CATEGORIES, ERRORS } = constants;

const createJob = require("./util/createJob");
jest.mock("./util/createJob");
const completeJob = require("./util/completeJob");
jest.mock("./util/completeJob");

const getGameList = require("./util/getGameList");
jest.mock("./util/getGameList");

const getCategoryTypeList = require("./util/getCategoryTypeList");
jest.mock("./util/getCategoryTypeList");

const getGameIdsForCategory = require("./util/getGameIdsForCategory");
jest.mock("./util/getGameIdsForCategory");

const getCategoryTypesForGame = require("./util/getCategoryTypesForGame");
jest.mock("./util/getCategoryTypesForGame");

const getIsMultiplayerGame = require("./util/getIsMultiplayerGame");
jest.mock("./util/getIsMultiplayerGame");

const writeGameData = require("./util/writeGameData");
jest.mock("./util/writeGameData");

const sleep = require("./util/sleep");
jest.mock("./util/sleep");

describe("runCron", () => {
  beforeEach(() => {
    getGameList.mockImplementationOnce(() => Promise.resolve([]));
    getCategoryTypesForGame.mockImplementation(() => []);
    getIsMultiplayerGame.mockImplementation(() => false);
    sleep.mockReset();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  const { runCron } = require("./scraper");
  const gameList = [{ appid: 1 }];
  const tagList = { Indie: ["1"] };
  const multiplayerTagList = { Multiplayer: ["1"] };
  const genreList = { Action: ["1"] };

  it("should create a new job", async () => {
    await runCron();
    expect(createJob).toHaveBeenCalled();
  });

  it("should retrieve a list of all games", async () => {
    await runCron();
    expect(getGameList).toHaveBeenCalled();
  });

  it("should set the no games found error if the retrieved games list is empty", async () => {
    const id = "foo";
    createJob.mockImplementationOnce(() => Promise.resolve({ id }));
    await runCron();
    expect(completeJob).toHaveBeenCalledWith(id, [ERRORS.NO_GAMES_FOUND]);
  });

  it("should retrieve a list of tags and genres if the games list has length", async () => {
    await runCron();
    expect(getCategoryTypeList).not.toHaveBeenCalled();

    getGameList.mockImplementationOnce(() => Promise.resolve(gameList));
    getGameIdsForCategory
      .mockImplementationOnce(() => Promise.resolve(tagList))
      .mockImplementationOnce(() => Promise.resolve(genreList));
    await runCron();
    expect(getCategoryTypeList).toHaveBeenCalledWith(STEAM_SPY_CATEGORIES.TAG);
    expect(getCategoryTypeList).toHaveBeenCalledWith(
      STEAM_SPY_CATEGORIES.GENRE
    );
  });

  it("should retrieve lists of game IDs by tag and genre if the games list has length", async () => {
    await runCron();
    expect(getGameIdsForCategory).not.toHaveBeenCalled();

    getGameList.mockImplementationOnce(() => Promise.resolve(gameList));
    getCategoryTypeList
      .mockImplementationOnce(() => Promise.resolve(tagList))
      .mockImplementationOnce(() => Promise.resolve(genreList));
    await runCron();
    expect(getGameIdsForCategory).toHaveBeenCalledWith(
      STEAM_SPY_CATEGORIES.TAG.name,
      tagList
    );
    expect(getGameIdsForCategory).toHaveBeenCalledWith(
      STEAM_SPY_CATEGORIES.GENRE.name,
      genreList
    );
  });

  it("should set the error for finding no tags if no tags were scraped", async () => {
    const id = "foo";
    getGameList.mockReset();
    createJob.mockImplementationOnce(() => Promise.resolve({ id }));
    getGameList.mockImplementationOnce(() => Promise.resolve(gameList));
    getCategoryTypeList
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() => Promise.resolve(genreList));
    await runCron();
    expect(completeJob).toHaveBeenCalledWith(id, [ERRORS.NO_TAGS_FOUND]);
  });

  it("should set the error for finding no genres if no genres were scraped", async () => {
    const id = "foo";
    getGameList.mockReset();
    createJob.mockImplementationOnce(() => Promise.resolve({ id }));
    getGameList.mockImplementationOnce(() => Promise.resolve(gameList));
    getGameIdsForCategory
      .mockImplementationOnce(() => Promise.resolve(tagList))
      .mockImplementationOnce(() => Promise.resolve({}));
    await runCron();
    expect(completeJob).toHaveBeenCalledWith(id, [ERRORS.NO_GENRES_FOUND]);
  });

  it("should build tag and genre lists for the games if the games list has length", async () => {
    await runCron();
    expect(getCategoryTypesForGame).not.toHaveBeenCalled();

    getGameList.mockImplementationOnce(() => Promise.resolve(gameList));
    getGameIdsForCategory
      .mockImplementationOnce(() => Promise.resolve(tagList))
      .mockImplementationOnce(() => Promise.resolve(genreList));
    await runCron();
    expect(getCategoryTypesForGame).toHaveBeenCalledWith(
      gameList[0].appid.toString(),
      tagList
    );
    expect(getCategoryTypesForGame).toHaveBeenCalledWith(
      gameList[0].appid.toString(),
      genreList
    );
  });

  it("should write data for a game if it is multiplayer", async () => {
    getGameList.mockReset();
    getIsMultiplayerGame.mockReset();
    getGameList.mockImplementationOnce(() => Promise.resolve(gameList));
    getIsMultiplayerGame.mockImplementationOnce(() => true);
    getGameIdsForCategory
      .mockImplementationOnce(() => Promise.resolve(multiplayerTagList))
      .mockImplementationOnce(() => Promise.resolve(genreList));
    await runCron();
    expect(getIsMultiplayerGame).toHaveBeenCalledWith(gameList[0].tags);
    expect(writeGameData).toHaveBeenCalledWith(gameReducer(gameList[0]));
  });

  it("should complete the job if the job was successfully created", async () => {
    const id = "foo";
    getGameList.mockReset();
    getGameList.mockImplementationOnce(() => Promise.resolve(gameList));
    createJob.mockImplementationOnce(() => Promise.resolve({ id }));
    getGameIdsForCategory
      .mockImplementationOnce(() => Promise.resolve(tagList))
      .mockImplementationOnce(() => Promise.resolve(genreList));
    await runCron();
    expect(completeJob).toHaveBeenCalledWith(id, []);
  });
});

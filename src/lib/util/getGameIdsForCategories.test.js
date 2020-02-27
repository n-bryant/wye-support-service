const mockAxios = require("axios");

const getIsValidCategory = require("./getIsValidCategory");
jest.mock("./getIsValidCategory");

const {
  getGameIdsForCategories,
  getRankedCategoryGames
} = require("./getGameIdsForCategories");
const constants = require("../constants");
const { STEAM_SPY_CATEGORIES } = constants;

describe("getGameIdsForCategories", () => {
  const types = [
    {
      name: "foo",
      idList: {
        "1": {
          appid: 1,
          owners: "20,000 .. 50,000",
          positive: 250,
          negative: 100
        }
      }
    },
    {
      name: "bar",
      idList: {
        "1": {
          appid: 1,
          owners: "20,000 .. 50,000",
          positive: 250,
          negative: 100
        },
        "2": {
          appid: 2,
          owners: "20,000 .. 50,000",
          positive: 250,
          negative: 100
        }
      }
    },
    {
      name: "fizz",
      idList: {
        "1": {
          appid: 1,
          owners: "20,000 .. 50,000",
          positive: 250,
          negative: 100
        },
        "2": {
          appid: 2,
          owners: "20,000 .. 50,000",
          positive: 250,
          negative: 100
        },
        "3": {
          appid: 3,
          owners: "20,000 .. 50,000",
          positive: 250,
          negative: 100
        }
      }
    }
  ];

  const expectedResult = {
    [types[0].name]: Object.keys(types[0].idList),
    [types[1].name]: Object.keys(types[1].idList),
    [types[2].name]: Object.keys(types[2].idList)
  };

  beforeEach(() => {
    getIsValidCategory.mockImplementationOnce(() => true);
    types.forEach(type => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: type.idList
        })
      );
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an empty object if not provided a valid category", async () => {
    getIsValidCategory.mockReset();
    getIsValidCategory.mockImplementationOnce(() => false);
    const result = await getGameIdsForCategories("fakeCategory", ["foo"]);
    expect(result).toEqual({});
  });

  it("should return an empty object if the provided type list is empty", async () => {
    getIsValidCategory.mockReset();
    getIsValidCategory.mockImplementationOnce(() => true);
    const result = await getGameIdsForCategories(
      STEAM_SPY_CATEGORIES.TAG.name,
      []
    );
    expect(result).toEqual({});
  });

  it("should return an object with a key for each type and a list of game IDs for that type", async () => {
    getIsValidCategory.mockReset();
    getIsValidCategory.mockImplementationOnce(() => true);
    const result = await getGameIdsForCategories(
      STEAM_SPY_CATEGORIES.TAG.name,
      types.map(type => type.name)
    );
    expect(result).toEqual(expectedResult);
  });
});

describe("getRankedCategoryGames", () => {
  const mockedList = [
    {
      appid: 1,
      owners: "20,000 .. 50,000",
      positive: 250,
      negative: 100,
      average_forever: 50
    },
    {
      appid: 2,
      owners: "100,000 .. 250,000",
      positive: 250,
      negative: 100,
      average_forever: 50
    },
    {
      appid: 3,
      owners: "50,000 .. 75,000",
      positive: 250,
      negative: 100,
      average_forever: 50
    },
    {
      appid: 4,
      owners: "50,000 .. 75,000",
      positive: 350,
      negative: 100,
      average_forever: 50
    }
  ];
  it("should return a list of items sorted by owner count, user rating, and average playtime", () => {
    expect(getRankedCategoryGames(mockedList).map(item => item.appid)).toEqual([
      2,
      4,
      3,
      1
    ]);
  });
});

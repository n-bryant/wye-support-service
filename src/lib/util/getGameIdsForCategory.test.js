const mockAxios = require("axios");

const getIsValidCategory = require("./getIsValidCategory");
jest.mock("./getIsValidCategory");

const getGameIdsForCategory = require("./getGameIdsForCategory");
const constants = require("../constants");
const { STEAM_SPY_CATEGORIES } = constants;

describe("getGameIdsForCategory", () => {
  const types = [
    {
      name: "foo",
      idList: {
        "1": "foo"
      }
    },
    {
      name: "bar",
      idList: {
        "1": "foo",
        "2": "bar"
      }
    },
    {
      name: "fizz",
      idList: {
        "1": "foo",
        "2": "bar",
        "3": "fizz"
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
    const result = await getGameIdsForCategory("fakeCategory", ["foo"]);
    expect(result).toEqual({});
  });

  it("should return an empty object if the provided type list is empty", async () => {
    getIsValidCategory.mockReset();
    getIsValidCategory.mockImplementationOnce(() => true);
    const result = await getGameIdsForCategory(
      STEAM_SPY_CATEGORIES.TAG.name,
      []
    );
    expect(result).toEqual({});
  });

  it("should return an on object with a key for each type and a list of game IDs for that type", async () => {
    getIsValidCategory.mockReset();
    getIsValidCategory.mockImplementationOnce(() => true);
    const result = await getGameIdsForCategory(
      STEAM_SPY_CATEGORIES.TAG.name,
      types.map(type => type.name)
    );
    expect(result).toEqual(expectedResult);
  });
});

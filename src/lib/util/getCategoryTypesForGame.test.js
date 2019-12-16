const getCategoryTypesForGame = require("./getCategoryTypesForGame");

describe("getCategoryTypesForGame", () => {
  const appid = "1";
  const typeList = {
    foo: ["2", "3", "4"],
    bar: ["3", appid],
    fizz: ["5", "3", "7", appid],
    buzz: ["6"]
  };
  const expectedResult = ["bar", "fizz"];

  it("return a list of matching category types for a given ID", () => {
    expect(getCategoryTypesForGame(appid, typeList)).toEqual(expectedResult);
  });
});

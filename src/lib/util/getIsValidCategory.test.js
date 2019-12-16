const constants = require("../constants");
const { STEAM_SPY_CATEGORIES } = constants;

const getIsValidCategory = require("./getIsValidCategory");

describe("getIsValidCategory", () => {
  it("should return truthy if the provided category has a match in the list of STEAM_SPY_CATEGORIES", () => {
    Object.keys(STEAM_SPY_CATEGORIES).forEach(key => {
      expect(getIsValidCategory(STEAM_SPY_CATEGORIES[key].name)).toBeTruthy();
    });
  });

  it("should return falsy if the provided category does not have a match in the list of STEAM_SPY_CATEGORIES", () => {
    expect(getIsValidCategory("invalid category")).toBeFalsy();
  });
});

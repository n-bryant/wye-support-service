const constants = require("../constants");
const { MULTIPLAYER_TAGS } = constants;

const getIsMultiplayerGame = require("./getIsMultiplayerGame");

describe("getIsMultiplayerGame", () => {
  it("should return truthy if the provided list of tags includes a match against the MULTIPLAYER_TAGS list", () => {
    MULTIPLAYER_TAGS.forEach(tag => {
      expect(getIsMultiplayerGame([tag])).toBeTruthy();
    });
  });

  it("should return falsy if the provided list of tags does not include a match against the MULTIPLAYER_TAGS list", () => {
    expect(getIsMultiplayerGame(["not a multiplayer tag"])).toBeFalsy();
  });
});

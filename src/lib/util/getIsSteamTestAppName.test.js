const getIsSteamTestAppName = require("./getIsSteamTestAppName");

describe("getIsSteamTestAppName", () => {
  it("should return truthy if the name provided is a test app name", () => {
    expect(getIsSteamTestAppName("ValveTestApp")).toBeTruthy();
  });

  it("should return falsy if the name provided is not a test app name", () => {
    expect(getIsSteamTestAppName("NotSteam")).toBeFalsy();
  });
});

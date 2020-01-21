const { gameReducer, getUserRatingPercentage } = require("./gameReducer");
const constants = require("../constants");

describe("gameReducer", () => {
  const game = {
    appid: 123,
    name: "name",
    developer: "developer 1, developer 2",
    publisher: "publisher 1, publisher 2",
    genres: ["foo", "bar"],
    tags: ["foo", "bar"],
    price: "100",
    discount: "0",
    initialprice: "100",
    positive: 300,
    negative: 50,
    average_2weeks: 10,
    average_forever: 200,
    ccu: 42,
    owners: 50
  };
  const result = gameReducer(game);

  it("should set the appid property to the game's appid value stringified", () => {
    expect(result.appid).toBe(game.appid.toString());
  });

  it("should set the returned name, developers, and publishers to the game's values for these fields", () => {
    expect(result.name).toBe(game.name);
    expect(result.developers).toBe(game.developer);
    expect(result.publishers).toBe(game.publisher);
  });

  it("should set the returned owners to the game's value for that field", () => {
    expect(result.owners).toBe(game.owners);
  });

  it("should set the playtime2Weeks value to the received average_2weeks value", () => {
    expect(result.playtime2Weeks).toBe(game.average_2weeks);
  });

  it("should set the playtimeForever value to the received average_forever value", () => {
    expect(result.playtimeForever).toBe(game.average_forever);
  });

  it("should set the returned genres to the game's joined genres value", () => {
    expect(result.genres).toBe(game.genres.join(", "));
  });

  it("should set the returned tags to the keys of the game's tags value", () => {
    expect(result.tags).toBe(game.tags.join(", "));
  });

  it("should base the freeToplay value on the game's price value", () => {
    expect(result.freeToPlay).toBeFalsy();
    const freeGame = gameReducer({ ...game, price: "0" });
    expect(freeGame.freeToPlay).toBeTruthy();
  });

  it("should base the onSale value on the game's discount value", () => {
    expect(result.onSale).toBeFalsy();
    const discountedGame = gameReducer({ ...game, discount: "50" });
    expect(discountedGame.onSale).toBeTruthy();
  });

  it("should base the discount, initialPrice and finalPrice value on the game's discount value", () => {
    expect(result.discount).toBe(0);
    expect(result.initialPrice).toBe(100);
    expect(result.finalPrice).toBe(100);
  });

  it("should utilize the getUserRatingPercentage to set the uerRating value", () => {
    expect(result.userRating).toBe(
      getUserRatingPercentage(game.positive, game.negative)
    );
  });

  it("should build the hero and logo image urls based on the game's appid and the base game image url", () => {
    const { GAME_IMAGES_BASE_URL } = constants;
    expect(result.heroImageUrl).toBe(
      `${GAME_IMAGES_BASE_URL}${game["appid"]}/library_hero.jpg`
    );
    expect(result.logoImageUrl).toBe(
      `${GAME_IMAGES_BASE_URL}${game["appid"]}/logo.png`
    );
  });
});

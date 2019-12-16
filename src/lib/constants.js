const STEAM_SPY_BASE_URL = "https://steamspy.com/api.php";

const STEAM_SPY_CATEGORIES = {
  TAG: {
    name: "tag",
    url: "https://store.steampowered.com/tag/browse/",
    selector: ".tag_browse_tags .tag_browse_tag"
  },
  GENRE: {
    name: "genre",
    url: "https://store.steampowered.com/games/",
    selector: ".contenthub_popular_tags .tag_name"
  }
};

const MULTIPLAYER_TAGS = [
  "Asynchronous Multiplayer",
  "Co-op",
  "Co-op Campaign",
  "Local Co-Op",
  "Local Multiplayer",
  "Massively Multiplayer",
  "MMORPG",
  "Multiplayer",
  "Online Co-Op",
  "Split Screen"
];

const GAME_IMAGES_BASE_URL = "http://steamcdn-a.akamaihd.net/steam/apps/";

const SLEEP_TIME = 1500;

const CRON_JOB_SCHEDULE_TIME = `0 3 * * *`;

const ERRORS = {
  NO_GAMES_FOUND: "NO_GAMES_FOUND"
};

module.exports = {
  STEAM_SPY_BASE_URL,
  STEAM_SPY_CATEGORIES,
  MULTIPLAYER_TAGS,
  GAME_IMAGES_BASE_URL,
  SLEEP_TIME,
  CRON_JOB_SCHEDULE_TIME,
  ERRORS
};

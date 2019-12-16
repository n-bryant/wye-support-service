const { prisma } = require("../../generated/js/index");

/**
 * writes a game's data to prisma db
 * - the upsert method updates a record or creates a new one if the record doesn't exist
 * @param {Object} data - the game data to write
 */
const writeGameData = async data => {
  if (data.appid) {
    try {
      await prisma.upsertGame({
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
    } catch (e) {
      console.log("Error writing game: ", data.appid);
      console.log(e);
    }
  }
};

module.exports = writeGameData;

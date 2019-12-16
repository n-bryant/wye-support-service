const cheerio = require("cheerio");

/**
 * utilizes provided selctor to scrape category type names from the provided html
 * @param {String} html
 * @param {String} selector
 * @returns {Array}
 */
const getCategoryNames = async (html, selector) => {
  let categoryNames = [];

  // load up cheerio
  const $ = cheerio.load(html);
  const categoryElement = $(selector);
  categoryElement.map((_i, el) => {
    categoryNames.push($(el).text());
  });

  return categoryNames;
};

module.exports = getCategoryNames;

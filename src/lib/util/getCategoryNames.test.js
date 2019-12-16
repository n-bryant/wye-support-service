const getCategoryNames = require("./getCategoryNames");

const className = "foo";
const html = `
  <div>
    <p class="${className}">fizz</p>
    <p class="${className}">fizz buzz</p>
    <p class="${className}">buzz</p>
  </div>
`;
const selector = `.${className}`;
const expectedResult = ["fizz", "fizz buzz", "buzz"];

describe("getCategoryNames", () => {
  it("should return a list of category names", async () => {
    const result = await getCategoryNames(html, selector);
    expect(result).toEqual(expectedResult);
  });
});

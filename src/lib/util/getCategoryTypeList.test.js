const getHTML = require("./getHTML");
jest.mock("./getHTML");

const getCategoryNames = require("./getCategoryNames");
jest.mock("./getCategoryNames");

const getCategoryTypeList = require("./getCategoryTypeList");

const category = {
  selector: "selector",
  url: "url"
};
const html = "<div>foo</div>";
const names = ["foo", "bar"];

describe("getCategoryTypeList", () => {
  it("should return a list of names generated from the provided category's selector and url", async () => {
    getHTML.mockImplementationOnce(() => html);
    getCategoryNames.mockImplementationOnce(() => names);
    const result = await getCategoryTypeList(category);
    expect(getCategoryNames).toHaveBeenCalledWith(html, category.selector);
    expect(result).toEqual(names);
  });
});

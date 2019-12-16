const mockAxios = require("axios");

const getHTML = require("./getHTML");

describe("getHTML", () => {
  const html = "<div></div>";
  it("should return the html contents of the provided url", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          html
        }
      })
    );
    const result = await getHTML("url");
    expect(result).toBe(html);
  });
});

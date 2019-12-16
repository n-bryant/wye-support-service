const sleep = require("./sleep");

jest.useFakeTimers();

describe("sleep", () => {
  it("creates a Promise that waits the specified amount of time in ms before resolving", () => {
    const ms = 1000;
    sleep(ms).then(
      expect(setTimeout).toHaveBeenCalledTimes(1),
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), ms)
    );
  });
});

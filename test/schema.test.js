const typeDefs = require("../src/schema");

it("creates a schema for wye-support-service", () => {
  expect(typeDefs).toMatchSnapshot();
});

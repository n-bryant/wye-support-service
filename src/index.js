require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");

const server = createServer();

server.listen({ port: process.env.PORT }).then(({ url }) => console.log(url));

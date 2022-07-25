const cors = require("cors");

process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Environment: ${process.env.NODE_ENV}`);

global.__basedir = __dirname;
global.__applicationStartDate = new Date();
global.__initialized = require("q").defer();
const baseUrl = "/healthcheck/";

const { express } = require("@modv/base-express");
const app = express.setup(baseUrl);

app.use(baseUrl, cors());
// Endpoints
app.use(baseUrl + "system", require("./api/controllers/system"));

async function main() {
  await express.serve(7789);
  global.__initialized.resolve();
}

main();

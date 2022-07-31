require("dotenv").config();
const express = require("express");
const app = express();

const { errorHandler } = require("./middleware");
const { ec2Routes } = require("./controllers");

const { path } = require("./constants");

app.use(path.serverRoute, ec2Routes);
app.use(errorHandler);

try {
  app.listen(process.env.PORT);
} catch (startError) {
  console.error(`Cannot start server. ${startError.toString()}`);
  process.exit(1);
}

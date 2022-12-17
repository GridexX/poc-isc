const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const winston = require('winston');
const expressWinston = require('express-winston');
require('dotenv').config()
const port = process.env.PORT || 3001;
const host = process.env.HOST || 'localhost';

app.all("*", function (_, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  next();
});


app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.json()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

const healthResult = {
  status: "ok",
};

app.get("/", function (_, res) {
  res.send("Welcome to the STS Server");
});

app.get("/health/ready", function (_, res) {
  res.send(healthResult);
});

app.get("/health/alive", function (_, res) {
  res.send(healthResult);
});

app.get("/token", function (_, res) {
  //In production, it will call the SSOServer to retrieve the user
  const obj = {
    id: 1,
    name: 'John Doe',
    iat: Date.now().valueOf(),
  }
  const token = jwt.sign(obj, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.send({
    token: token
  })
})

app.post("/verify/:token", function (req, res) {
  const token = req.params.token
  jwt.verify(token, process.env.JWT_SECRET, function (err, _) {
    if (err) {
      //Send a 401 if the token isn't valid
      res.status(401).send({
        valid: false
      })
    } else {
      //Otherwise send a 204
      res.status(204).send()
    }

  })
});

app.get("*", function (_, res) {
  res.status(404).send(" 404 - Page not found ");
});

app.listen({ port: port, host: host }, function () {
  console.log(`Server running on http://${host}:${port}`);
});
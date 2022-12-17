const net = require('net');
const express = require("express");
const app = express();

const winston = require('winston');
const expressWinston = require('express-winston');
require('dotenv').config()
const avro = require('avsc');
const { promisifyAll } = require('./lib');
promisifyAll(avro.Service);

// read the avro protocol and parse it
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const filePath = path.join("avro", 'excuseProtocol.avpr');
const excuseProtocol = fs.readFileSync(filePath, 'utf8');
const protocol = avro.readProtocol(excuseProtocol);

// We first compile the IDL specification into a JSON protocol.
const service = avro.Service.forProtocol(protocol);
let server = { close: () => { } };
const TCP_PORT = process.env.TCP_PORT || 24950;
const STS_PORT = process.env.STS_PORT || 3001;
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const hostAPI = process.env.HOST_API || 'localhost';
const hostSTS = process.env.HOST_STS || 'localhost';

// Call the STS to get the token
// Doesn't handle the error, to fail if the STS is not available
connectToSTSAndReturnToken = async () => {
  const response = await axios.get(`http://${hostSTS}:${STS_PORT}/token`)
  return response.data.token;
}


clientTCP = net.createConnection({ host: host, port: TCP_PORT }, async () => {
  const token = await connectToSTSAndReturnToken();
  console.log('connected to server!');
  if (token) {
    clientTCP.write(JSON.stringify({ token: token }));
  }
})


clientTCP.on('close', () => {
  console.log('disconnected from server');
  server?.close();
});

clientTCP.on("data", (data) => {
  try {
    data = JSON.parse(data);
    console.log("Received: " + JSON.stringify(data));
    if (data?.tokenIsValid === true) {
      console.log("Token is valid");
      server = app.listen({ host: hostAPI, port: port }, function () {
        console.log(`Server running on http://${host}:${port}`);
      });
    } else {
      console.log("Token is not valid");
      // clientTCP.end();
    }
  } catch (_) {
    ;
    // console.log("Error parsing data: " + e);
  }
});

const client = service.createClient({
  buffering: true,
  transport: clientTCP,
});



app.all("*", function (req, res, next) {
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
  res.send("Welcome to the Excuse Generator API");
});

app.get("/health/ready", function (_, res) {
  res.send(healthResult);
});

app.get("/health/alive", function (_, res) {
  res.send(healthResult);
});


// returns 1 random excuses
app.get("/excuse", async function (req, res) {
  const result = await client.getRandom(1);
  res.send(result);
});

// returns the excuse having the specific id
app.get("/excuse/id/:num(\\d+)?", async function (req, res) {
  const result = await client.getByID(parseInt(req.params.num));
  res.send(result);
});


// returns n random excuses
app.get("/excuse/:num(\\d+)?", async function (req, res) {
  const result = await client.getRandom(parseInt(req.params.num));
  res.send(result);
});

// returns excuse based on specific category
app.get("/excuse/:category", async function (req, res) {
  const result = await client.getByCategory(req.params.category, 1);
  res.send(result);
});

// returns n excuse based on specific category
app.get("/excuse/:category/:num(\\d+)?", async function (req, res) {
  const result = await client.getByCategory(req.params.category, parseInt(req.params.num) || 1);
  res.send(result);

});

app.get("*", function (_, res) {
  res.status(404).send(" 404 - Page not found ");
});


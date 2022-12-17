require("dotenv").config();
const winston = require('winston');
const expressWinston = require('express-winston');
const { setupRoutes } = require('./routes');
const hostAPI = process.env.HOST_API || 'localhost';
const port = process.env.PORT || 3000;

function setupApp(app, client, logger) {
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
      winston.format.timestamp(),
      winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
  }));

  setupRoutes(app, client);

  return app.listen({ host: hostAPI, port: port }, function () {
    logger.info(`Server running on http://${hostAPI}:${port}`);
  });

}

module.exports = {
  setupApp
};


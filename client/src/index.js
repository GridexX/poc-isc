const express = require("express");
const { setupApp } = require("./setupApp");
const { setupAvro, bindClientToService } = require("./avro");
const { setupClient, sendToken, functionAfterValidation, functionOnDisconnect } = require("./tcpClient");
const { getToken } = require("./sts");
const winston = require('winston');


async function start() {
  const app = express();
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console()
    ]
  });


  let { clientTCP, errorClient } = setupClient(logger);

  if (errorClient) {
    logger.error(error);
    clientTCP.end();
    return;
  }

  service = setupAvro();

  const { token, error } = await getToken(logger)

  if (error) {
    logger.error(error);
    clientTCP.end();
    return;
  }

  sendToken(token, clientTCP);

  //Wait a bit before binding AVRO client to service
  await new Promise(resolve => setTimeout(resolve, 500));
  client = bindClientToService(service, clientTCP);

  functionAfterValidation.apply = () => {
    const server = setupApp(app, client, logger);
    functionOnDisconnect.apply = () => {
      server.close();
    }
  }
  functionAfterValidation.apply()

}

start() 
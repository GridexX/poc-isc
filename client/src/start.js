const express = require("express");
const { setupApp } = require("./setupApp");
const { setupAvro, bindClientToService } = require("./avro");
const { setupClient, sendToken, functionAfterValidation } = require("./tcpClient");
const { getToken } = require("./sts");

async function start() {
  const app = express();
  clientTCP = setupClient();
  service = setupAvro();
  client = bindClientToService(service, clientTCP);
  const { token, error } = await getToken()

  if (error) {
    console.log("Error getting token from STS");
    clientTCP.end();
    return;
  }
  functionAfterValidation.apply = () => {
    setupApp(app, client);
  }
  sendToken(token, clientTCP);


}

module.exports = {
  start,
};
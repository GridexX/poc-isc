const net = require('net');
dotenv = require('dotenv');
const TCP_PORT = process.env.TCP_PORT || 24950;
const host = process.env.HOST || 'localhost';

const functionAfterValidation = { apply: () => { } };
const functionOnDisconnect = { apply: () => { } };
let validateToken = false;

function setupClient(logger) {
  clientTCP = net.createConnection({ host: host, port: TCP_PORT });
  let error = null;
  clientTCP.on('close', () => {
    logger.info('disconnected from server');
    functionOnDisconnect.apply();
    clientTCP.end();
  });


  clientTCP.on('data', (data) => {
    if (!validateToken) {

      try {
        data = JSON.parse(data);
        logger.info("Received: " + JSON.stringify(data));

        if (data?.valid === true) {
          logger.info("Token is valid");
          validateToken = true;
          functionAfterValidation.apply();

        } else {

          logger.error("Token is not valid");
          clientTCP.end();
          return { error: "Token is not valid" };
        }
      } catch (err) {
        logger.error(err);
      }
    }
  });

  return { clientTCP, error };
}

function sendToken(token, clientTCP) {
  clientTCP.write(JSON.stringify({ token: token }));
}


module.exports = {
  setupClient,
  sendToken,
  functionAfterValidation,
  functionOnDisconnect
}
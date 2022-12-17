const net = require('net');
const TCP_PORT = process.env.TCP_PORT || 24950;
const host = process.env.HOST || 'localhost';
dotenv = require('dotenv');

const functionAfterValidation = { apply: () => { } };

function setupClient() {
  clientTCP = net.createConnection({ host: host, port: TCP_PORT });

  clientTCP.on('close', () => {
    console.log('disconnected from server');
    clientTCP.end();
  });

  clientTCP.on('data', (data) => {
    try {
      data = JSON.parse(data);
      console.log("Received: " + JSON.stringify(data));
      if (data?.tokenIsValid === true) {
        console.log("Token is valid");
        functionAfterValidation.apply();
      } else {
        console.log("Token is not valid");
        clientTCP.end();
      }
    } catch (err) {
      console.log(err);
    }
  });

  return clientTCP;
}

function sendToken(token, clientTCP) {
  clientTCP.write(JSON.stringify({ token: token }));
}


module.exports = {
  setupClient,
  sendToken,
  functionAfterValidation
}
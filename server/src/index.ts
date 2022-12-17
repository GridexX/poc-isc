import { compileFunction } from "vm";
import { ExcuseInterface } from "./excuseInterface";
import { isClientVerified, isTokenValidForClient } from "./token";
require("@avro/types");
require('dotenv').config()


const winston = require('winston');
const net = require('net');
const avro = require( 'avsc');
const { promisifyAll } = require('../lib');
const excuseRepository = require('./excuseRepository');
const TCP_PORT = process.env.TCP_PORT || 24950;


promisifyAll(avro.Service);

// read the avro protocol and parse it
const fs = require('fs');
const path = require('path');
const filePath = path.join("avro", 'excuseProtocol.avpr');
const excuseProtocol = fs.readFileSync(filePath, 'utf8');
const protocol = avro.readProtocol(excuseProtocol);

// We first compile the IDL specification into a JSON protocol.
const service = avro.Service.forProtocol(protocol);

const server = service.createServer()
  .onGetByID(async function (id: number): Promise<ExcuseInterface> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const excuse = excuseRepository.getByID(id);
    return excuse;
  })
  .onGetByCategory(async function (category: string, numberOfExcuses: number): Promise<ExcuseInterface[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const excuses = excuseRepository.getByCategory(category, numberOfExcuses);
    return excuses;
  })
  .onGetRandom(async function (numberOfExcuses: number): Promise<ExcuseInterface[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const excuses = excuseRepository.getRandom(numberOfExcuses);
    return excuses;
  });

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


// Set up the server to listen to incoming connections on port 24950.


net.createServer({ keepAlive: true, keepAliveInitialDelay: 3600})
  .on('connection', function (con: any) { 
    con.setKeepAlive(true, 3600);
    con.on('end', () => {
      logger.info('client disconnected ' + con.remoteAddress);
    });
    //On connection, we print the remote address and port of the client.
    const client = con.remoteAddress + ':' + con.remotePort;
    logger.info('client connected ' + client);
    con.on('data', async(data: string) => {
      logger.info('Received data from client' + client + ': ' + data);

      let token = null;
      try {
        token = JSON.parse(data).token
      } catch (_) {}

      if(!isClientVerified(token, client) && token) {
        logger.info('Token Received')
        //Verify the token
        logger.info('Send request to STS to verify token')
        let {valid, error} = await isTokenValidForClient(token, client, logger)
        con.write(JSON.stringify({valid, error}))
        if(!valid) {
          logger.error('Invalid Token');
          con.end();
        } else {
          logger.info('Create channel for Avro')
          server.createChannel(con); 
        }
      }

    });
  })
  .on('listening', function () { logger.info('TCP server listening on port ' + TCP_PORT); })
  .listen(TCP_PORT)

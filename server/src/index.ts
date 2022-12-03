import { ExcuseInterface } from "./excuseInterface";

const net = require('net');
const avro = require( 'avsc');
require("@avro/types");
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



// Set up the server to listen to incoming connections on port 24950.

net.createServer({ keepAlive: true, keepAliveInitialDelay: 3600})
  .on('connection', function (con: any) { 
    con.setKeepAlive(true, 3600);
    con.on('end', () => {
      console.log('client disconnected ' + con.remoteAddress);
    });
    //On connection, we print the remote address and port of the client.
    console.log('client connected ' + con.remoteAddress + ':' + con.remotePort);
    con.on('data', (data: string) => {
      console.log('data received '+data);
    });
    server.createChannel(con); 
  })
  .on('listening', function () { console.log('TCP server listening on port ' + TCP_PORT); })
  .listen(TCP_PORT)

const avro = require('avsc');
const { promisifyAll } = require('../lib');
promisifyAll(avro.Service);
// read the avro protocol and parse it
const fs = require('fs');
const path = require('path');


function setupAvro() {
  const filePath = path.join("avro", 'excuseProtocol.avpr');
  const excuseProtocol = fs.readFileSync(filePath, 'utf8');
  const protocol = avro.readProtocol(excuseProtocol);
  const service = avro.Service.forProtocol(protocol);

  return service;
}

function bindClientToService(service, client) {
  client = service.createClient({
    buffering: true,
    transport: client
  });

  return client;
}

module.exports = {
  setupAvro,
  bindClientToService,
}
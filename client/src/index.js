const { start } = require('./start');

start();



// promisifyAll(avro.Service);



// // We first compile the IDL specification into a JSON protocol.
// const service = avro.Service.forProtocol(protocol);
// let server = { close: () => { } };
// const TCP_PORT = process.env.TCP_PORT || 24950;
// const STS_PORT = process.env.STS_PORT || 3001;
// const port = process.env.PORT || 3000;
// const host = process.env.HOST || 'localhost';
// const hostAPI = process.env.HOST_API || 'localhost';
// const hostSTS = process.env.HOST_STS || 'localhost';



// const clientTCP = net.createConnection({ host: host, port: TCP_PORT }, () => {
//   console.log('connected to server!');
// });

// clientTCP.on('data', (data) => {
//   console.log('connection to server!' + data);
// });

// const client = service.createClient({
//   buffering: true,
//   transport: clientTCP
// });

// // Call the STS to get the token
// // Doesn't handle the error, to fail if the STS is not available
// connectToSTSAndReturnToken = async () => {
//   const response = await axios.get(`http://${hostSTS}:${STS_PORT}/token`)
//   return response.data.token;
// }



// setupClient = async (service) => {
//   clientTCP = await net.createConnection({ host: host, port: TCP_PORT }, async () => {
//     const token = await connectToSTSAndReturnToken();
//     console.log('connected to server!');
//     if (token) {
//       clientTCP.write(JSON.stringify({ token: token }));
//     }
//   })

//   clientTCP.on('close', () => {
//     console.log('disconnected from server');
//     server?.close();
//   });

//   clientTCP.on("data", (data) => {
//     try {
//       data = JSON.parse(data);
//       console.log("Received: " + JSON.stringify(data));
//       if (data?.tokenIsValid === true) {
//         console.log("Token is valid");
//         server = app.listen({ host: hostAPI, port: port }, function () {
//           console.log(`Server running on http://${host}:${port}`);
//         });
//       } else {
//         console.log("Token is not valid");
//         // clientTCP.end();
//       }
//     } catch (_) {
//       ;
//       // console.log("Error parsing data: " + e);
//     }
//   });

//   let client = service.createClient({
//     buffering: true,
//     transport: clientTCP
//   })

//   return client;

// }

// let client = await setupClient(service);



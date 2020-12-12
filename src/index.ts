import * as uWS from "uWebSockets.js";
// const uWS =  require('uWebSockets.js')
import * as redis from "redis";
import * as express from "express";
import * as enableWs from "express-ws";
import * as WebSocket from "ws";
import { applicationController } from "./controller";
export const conf: redis.ClientOpts = {
  password: 'T7z-75F-34m-rGC',
  host: "192.168.0.111",
}
let socketClosed = false;
const app = express();
const wss = enableWs(app)
const subscriber = redis.createClient(conf)

// const wss = new WebSocket.Server({ noServer: true });

const server = app.listen(4000);
// server.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, socket => {
//     wss.emit('connection', socket, request);
//   });
// });

app.ws('/', function connection(ws,req) {
  ws.on('message', function incoming(data) {
    try {
      const result = applicationController(JSON.parse(data))
      // subscriber.on("message", function (channel, message) {
      //   console.log('broadcast', message)
      //     ws.send( message)
      // });
      result.then(_data => {
        wss.getWss().clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN && _data.method == 'POST') {
            client.send(JSON.stringify(_data.data));
          } else if (_data.method == 'GET') {
            client.send(JSON.stringify(_data.data));
          }
        });
      })
      subscriber.subscribe("moldb");
    } catch (error) {
      ws.send('not valid request')
    }

  });
});
// uWS.App().ws('/*', {

//   compression: uWS.SHARED_COMPRESSOR,
//   maxPayloadLength: 16 * 1024 * 1024,
//   idleTimeout: 100,
//   maxBackpressure: 1024,

//   open: (ws) => {
//     socketClosed = false;
//     ws.subscribe('/')
//   },
//   message: (ws, message, isBinary) => {
//     const response = (new TextDecoder('utf-8')).decode(message)
//     try {
//       const result = applicationController(JSON.parse(response))
//       subscriber.on("message", function (channel, message) {
//         console.log('broadcast', message)
//         if (!socketClosed) {
//           ws.publish('/', message)
//         }
//       });

//       result.then(data => {
//         if (!data.method == 'POST') {

//           ws.publish('/', JSON.stringify(data))
//         }
//       })
//       subscriber.subscribe("moldb");
//     } catch (error) {
//       ws.send('not valid request')
//     }
//   }
//   ,
//   close: (ws, code, message) => {
//     socketClosed = true;
//   }

// }).get('/*', (res, req) => {
//   res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');

// }).listen(4000, (listenSocket) => {

//   if (listenSocket) {
//     console.log('Listening to port 4000');
//   }

// });
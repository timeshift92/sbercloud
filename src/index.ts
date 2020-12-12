import * as uWS from "uWebSockets.js";
// const uWS =  require('uWebSockets.js')
import * as redis from "redis";

import { applicationController } from "./controller";
export const conf: redis.ClientOpts = {
  password: 'T7z-75F-34m-rGC',
  host: "192.168.0.111",
}
let socketClosed = false;
const subscriber = redis.createClient(conf)
uWS.App().ws('/*', {

  compression: uWS.SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024 * 1024,
  idleTimeout: 100,
  maxBackpressure: 1024,

  open: (ws) => {
    socketClosed = false;
    // ws.subscribe('/')
  },
  message: (ws, message, isBinary) => {
    const response = (new TextDecoder('utf-8')).decode(message)
    try {
      const result = applicationController(JSON.parse(response))
      subscriber.on("message", function (channel, message) {
        console.log('broadcast', message)
        if (!socketClosed) {
          ws.send( message)
        }
      });

      result.then(data => {
        if (!socketClosed) {
          console.log(ws.getBufferedAmount())
          ws.send(JSON.stringify(data))
        }
      })
      subscriber.subscribe("moldb");
    } catch (error) {
      ws.send('not valid request')
    }
  }
  ,
  close: (ws, code, message) => {
    socketClosed = true;
  }

}).get('/*', (res, req) => {
  res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');

}).listen(4000, (listenSocket) => {

  if (listenSocket) {
    console.log('Listening to port 4000');
  }

});
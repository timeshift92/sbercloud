import * as redis from "redis";
import * as express from "express";
import * as enableWs from "express-ws";
import * as WebSocket from "ws";
import { applicationController } from "./controller";
export const conf: redis.ClientOpts = {
  password: 'T7z-75F-34m-rGC',
  host: "192.168.0.111",
}
const app = express();
const wss = enableWs(app)
const subscriber = redis.createClient(conf)


app.listen(4000);

app.ws('/', function connection(ws, req) {
  ws.on('message', function incoming(data) {
    try {
      const result = applicationController(JSON.parse(data))
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

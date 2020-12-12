"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conf = void 0;
var uWS = require("uWebSockets.js");
// const uWS =  require('uWebSockets.js')
var redis = require("redis");
var controller_1 = require("./controller");
exports.conf = {
    password: 'T7z-75F-34m-rGC',
    host: "192.168.0.111",
};
var socketClosed = false;
var subscriber = redis.createClient(exports.conf);
uWS.App().ws('/*', {
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 100,
    maxBackpressure: 1024,
    open: function (ws) {
        socketClosed = false;
        // ws.subscribe('/')
    },
    message: function (ws, message, isBinary) {
        var response = (new TextDecoder('utf-8')).decode(message);
        try {
            var result = controller_1.applicationController(JSON.parse(response));
            subscriber.on("message", function (channel, message) {
                console.log('broadcast', message);
                if (!socketClosed) {
                    ws.send(message);
                }
            });
            result.then(function (data) {
                if (!socketClosed) {
                    console.log(ws.getBufferedAmount());
                    ws.send(JSON.stringify(data));
                }
            });
            subscriber.subscribe("moldb");
        }
        catch (error) {
            ws.send('not valid request');
        }
    },
    close: function (ws, code, message) {
        socketClosed = true;
    }
}).get('/*', function (res, req) {
    res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
}).listen(4000, function (listenSocket) {
    if (listenSocket) {
        console.log('Listening to port 4000');
    }
});
//# sourceMappingURL=index.js.map
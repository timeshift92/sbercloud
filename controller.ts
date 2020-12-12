import { WebSocket } from "uWebSockets.js";
import { getData,insertData } from "./mongoApi";
export async function applicationController(ws: WebSocket, body: [string, object | null]) {
    if (body.length <= 1 || (body.length > 1 && body[1] == null)) {
        return await getData(body[0]);
    } else if (body.length > 1) {
        return await insertData(body);
    }

}
import * as redis from "redis";
import { promisify } from "util";

export const conf: redis.ClientOpts = {
    password: 'T7z-75F-34m-rGC',
    host: "192.168.0.111",
}
const rds = redis.createClient(conf)
import { getData, insertData } from "./mongoApi";
export async function applicationController(body: [string, object | null]) {
    const getAsync = promisify(rds.get).bind(rds);
    if (body.length <= 1 || (body.length > 1 && body[1] == null)) {
        const redis:any = await getData(body[0]);       
        return   JSON.parse(await getAsync(body[0]))
        // return ;
    } else if (body.length > 1) {
        rds.set(body[0], JSON.stringify([body[0],{ _id: body[0], ...body[1] }]))
        rds.incr('queue')
        await insertData(body);
        return [body[0],{ _id: body[0], ...body[1] }]

    }

}
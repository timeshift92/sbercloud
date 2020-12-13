import { MongoClient } from "mongodb";
import * as redis from "redis";
const mongoClient = new MongoClient("mongodb://rwuser:T7z-75F-34m-rGC@192.168.0.69:8635,192.168.0.106:8635,192.168.0.214:8635,192.168.0.100:8635,192.168.0.11:8635,192.168.0.216:8635,192.168.0.125:8635,192.168.0.5:8635,192.168.0.114:8635,192.168.0.132:8635/test?authSource=admin", {
    maxPoolSize: 500,
    useNewUrlParser: true,
    useUnifiedTopology: true

});
const publisher = redis.createClient({
    password: 'T7z-75F-34m-rGC',
    host: "192.168.0.111",
});

let client;
mongoClient.connect().then(cl => {
    client = cl;
})

export async function getData(index) {
    let resolve, reject
    let result = new Promise((r, rj) => { resolve = r; reject = rj });
    try {

        const db = client.db("moldb")
        const rs = await db.collection('moldb').find({
            _id: index

        }).toArray((err, _result) => {
            if (err) {
                console.error(err)
                return
            }
            resolve([index, ..._result])
        });


    } catch (e) {
        console.error(e);
    } finally {
        // await mongoClient.close();
    }
    return result
}

export async function insertData(body) {
    let resolve, reject
    let result = new Promise((r, rj) => { resolve = r; reject = rj });
    try {

        
        const db = client.db("moldb")
        const collection = await db.collection('moldb');
        const data = { _id: body[0], ...body[1] };

        collection.updateOne({ _id: body[0] }, { $set: data }, { upsert: true }, async function (err, result) {
            if (err) {
                console.log(err)
                reject(err)
                return
            }

            const doc = await getData(body[0])
            publisher.publish('moldb', JSON.stringify({ data: [body[0], { _id: body[0], ...body[1] }], method: 'POST' }))
            resolve(doc)
        })
    } catch (e) {
        console.error(e);
    } finally {

    }
    return result
}

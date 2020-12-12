import { Db, MongoClient } from "mongodb";
import * as redis from "redis";
import { conf } from ".";

const mongoClient = new MongoClient("mongodb://rwuser:T7z-75F-34m-rGC@192.168.0.69:8635,192.168.0.106:8635,192.168.0.214:8635,192.168.0.100:8635,192.168.0.11:8635,192.168.0.216:8635,192.168.0.125:8635,192.168.0.5:8635,192.168.0.114:8635,192.168.0.132:8635/test?authSource=admin", { useUnifiedTopology: true });
const publisher = redis.createClient({
    password: 'T7z-75F-34m-rGC',
    host: "192.168.0.111",
});

export async function dbResolver(resolver = async (client: Db) => { }) {
    try {
        const client = await mongoClient.connect();
        const db = client.db("moldb")
        const changeStream = db.watch();

        changeStream.on('change', next => {
            console.log('changed ', next['fullDocument'])
            // process next document
        });

    } catch (e) {
        console.error(e);
    } finally {
        // await mongoClient.close();
    }

}


export async function getData(index) {
    let resolve, reject
    let result = new Promise((r, rj) => { resolve = r; reject = rj });
    try {
        const client = await mongoClient.connect();
        const db = client.db("moldb")
        // db.collection(index).find({

        // }, async (err, _result) => {
        //     if (err) {
        //         console.error(err)
        //         return
        //     }
        //     console.log(index)
        //     console.log(_result.ops)
        //     resolve( _result.ops)

        // });

        const rs = await db.collection('tester').find({

        });
        console.log(rs)
        
        
    } catch (e) {
        console.error(e);
    } finally {
        // await mongoClient.close();
    }
    return result
}

export async function insertData(body) {
    let result;
    try {
        const client = await mongoClient.connect();
        const db = client.db("moldb")
        const collection = await db.createCollection(body[0]);
        collection.insertOne(body[1], function (err, result) {
            if (err) {
                console.log(err)
            }
            publisher.publish('moldb', JSON.stringify(result.ops))
            mongoClient.close();
        })
    } catch (e) {
        console.error(e);
    } finally {

    }
    return result
}

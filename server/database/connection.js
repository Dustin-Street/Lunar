import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from 'mongoose'

const uri = process.env.ATLAS_URI

const client = new MongoClient(uri, {
    serverApi: {

        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});




async function mongooseMongoAtlasConnect() {
    try {
        await mongoose.connect(uri, {})
        if (uri !== 'mongodb://127.0.0.1:27017/InsightLocal') {
            console.log('connected to MongoAtlas database (cloud)');
        }
        else {
            console.log('connected to mongoDB local // fallback')
        }


    } catch (err) {
        console.log(err)
    }
}

mongooseMongoAtlasConnect().catch(err => console.log(err));


let database = client.db('Insight')

export default database;
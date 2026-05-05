import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";

const uri = process.env.ATLAS_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function mongooseMongoAtlasConnect() {
  try {
    await mongoose.connect(uri, {});
  } catch (err) {
    console.log(err);
  }
}

mongooseMongoAtlasConnect().catch((err) => console.log(err));

let database = client.db("Lunar");

export default database;

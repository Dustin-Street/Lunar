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
    console.log()
  } catch (err) {
    console.log(err);
  }
}

mongooseMongoAtlasConnect().catch((err) => console.log(err));

let database = client.db("lunar_dev");

export default database;

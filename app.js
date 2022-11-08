const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const uri = require("./Config/Database");
//middlewares
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("Wedding");
    const collection = database.collection("Services");

    app.post('/services',async(req,res)=>{
        const {title,email,price,imageUrl,shortDesc,fullDesc} = req.body;
        const doc = {title,email,price,imageUrl,shortDesc,fullDesc};
        const result = await collection.insertOne(doc);
        console.log(result);
        res.status(200).send(result);
    })
    app.get('/services/:limit',async(req,res)=>{
        const limit = parseInt(req.params.limit);
        const query = {};
        const options = {};
        const cursor = collection.find(query,options);
        const result = await cursor.limit(limit).toArray();
        res.status(200).send(result);
    })

  } finally {
   
  }
}

run().catch(err=>console.log(err));

module.exports = app;

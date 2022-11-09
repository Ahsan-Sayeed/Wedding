const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const reviewCollection = database.collection("Reviews")

    app.post('/services',async(req,res)=>{
        const {title,email,price,imageUrl,shortDesc,fullDesc} = req.body;
        const doc = {title,email,price,imageUrl,shortDesc,fullDesc};
        const result = await collection.insertOne(doc);
        console.log(result);
        res.status(200).send(result);
    })
    app.get('/services',async(req,res)=>{
        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);
        const query = {};
        const options = {};
        const cursor = collection.find(query,options);
        const result = await cursor.skip(skip).limit(limit).toArray();
        const count = await collection.estimatedDocumentCount();
        res.status(200).send({count,result});
    })
    app.get('/services/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const options = {};
      const result = await collection.findOne(query,options);
      res.status(200).send(result);
    })
    app.post('/review',async(req,res)=>{
      const {email,imageUrl,message,rating,displayName} = req.body;
      const date = (new Date(Date.now())).toDateString() + " " + (new Date(Date.now())).toLocaleTimeString();
      const doc = {email,displayName,message,rating,imageUrl,date};
      const result = await reviewCollection.insertOne(doc);
      res.status(200).send(result);
    })
    app.get('/review',async(req,res)=>{
      const query = {};
      const options = {};
      const cursor = reviewCollection.find(query,options);
      const result = await cursor.toArray();
      const count = await reviewCollection.estimatedDocumentCount();
      res.status(200).send({count,result});
    })

  } finally {
   
  }
}

run().catch(err=>console.log(err));

module.exports = app;

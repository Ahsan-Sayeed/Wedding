const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const uri = require("./Config/Database");
const {verifyToken} = require('./Middlewares/CheckToken');
require('dotenv').config();
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
    const reviewCollection = database.collection("Reviews");

    app.post("/services", async (req, res) => {
      const { title, email, price, imageUrl, shortDesc, fullDesc } = req.body;
      const doc = { title, email, price, imageUrl, shortDesc, fullDesc, time:Date.now()};
      const result = await collection.insertOne(doc);
      res.status(200).send(result);
    });
    app.get("/services", async (req, res) => {
      const limit = parseInt(req.query.limit);
      const skip = Math.abs(parseInt(req.query.skip));
      const query = {};
      const options = {};
      const cursor = collection.find(query, options);
      const result = await cursor.skip(skip).limit(limit).sort({time:-1}).toArray();
      const count = await collection.estimatedDocumentCount();
      res.status(200).send({ count, result });
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = {};
      const result = await collection.findOne(query, options);
      res.status(200).send(result);
    });
    app.post("/review", async (req, res) => {
      const {
        email,
        imageUrl,
        message,
        rating,
        displayName,
        serviceId,
        title,
        price,
        thum,
        shortDesc,
        uid
      } = req.body;
      const date =
        new Date(Date.now()).toDateString() +
        " " +
        new Date(Date.now()).toLocaleTimeString();
      const doc = {
        email,
        displayName,
        message,
        rating,
        imageUrl,
        date,
        serviceId,
        title,
        price,
        thum,
        shortDesc,
        uid,
        time:Date.now()
      };
      const result = await reviewCollection.insertOne(doc);
      res.status(200).send(result);
    });
    app.get("/review", async (req, res) => {
      const query = {};
      const options = {};
      const cursor = reviewCollection.find(query, options);
      const result = await cursor.sort({time:-1}).toArray();
      const count = await reviewCollection.estimatedDocumentCount();
      res.status(200).send({ count, result });
    });
    app.get("/review/profile",verifyToken, async (req, res) => {
      const uid = req.query.uid;
      const decoded = req.decoded;
      if(decoded!==uid){
        req.status(403).send({message:'unauthorized'});
      }
      const query = {uid:uid};
      const options = {};
      const cursor = reviewCollection.find(query, options);
      const result = await cursor.sort({time:-1}).toArray();
      const count = result.length;
      res.status(200).send({ count, result });
    });
    app.get("/review/:serviceid", async (req, res) => {
      const serviceId = req.params.serviceid;
      const query = {serviceId: serviceId};
      const options = {};
      const cursor = reviewCollection.find(query, options);
      const result = await cursor.sort({time:-1}).toArray();
      const count = result.length;
      res.status(200).send({ count, result });
    });
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
    app.put('/review/:id',async(req,res)=>{
      const id = req.params.id;
      const comment = req.body.comment;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          message: comment
        }
      };
      const result = await reviewCollection.updateOne(filter, updateDoc, options);
      res.status(200).send(result);
    })

    //JWT
    app.post("/jwt",(req,res)=>{
      const key = req.body.key;
      const token = jwt.sign(key, process.env.SECRET_TOKEN);
      res.status(200).send({token});
    })

  } finally {
  }
}

run().catch((err) => console.log(err));

module.exports = app;

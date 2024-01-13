const { MongoClient, ServerApiVersion} = require('mongodb');
const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.s5rla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      
      const database = client.db("Inventual_DB");
      const productsCollection = database.collection('products');
      
      // GET api
      app.get('/products',async(req,res) => {
        const cursor = productsCollection.find({});
        const products = await cursor.toArray();
        res.json(products);
      })


      // Single GET api
      app.get('/products/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id : ObjectId(id)};
        const product = await productsCollection.findOne(query);
        console.log('Single Product Id', id);
        res.send(product);
      })


      // POST api
      app.post('/products',async(req,res) => {
        const product = req.body;
        const result = await productsCollection.insertOne(product);
        console.log(result);
        res.json(result);
      })


      // DELETE Api
      app.delete('/products/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id : ObjectId(id)};
        console.log('Deleting with id', id);
        const result = await productsCollection.deleteOne(query);
         console.log(result)
        res.json(result);
      })
    } finally {
      
      // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
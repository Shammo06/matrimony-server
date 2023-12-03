const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1u0fohl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const biodatasCollection = client.db('BiodatasDB').collection('Biodata');
    const storyCollection = client.db('StoryDB').collection('story');
    const favouriteCollection = client.db('FavouriteDB').collection('favourite');
    
    app.get('/biodatas', async(req,res) => {
      let query= {}
      console.log(req.query)
      if(req.query?.biodataType){
        query={biodataType:req.query.biodataType}
      }
      const result = await biodatasCollection.find(query).sort({age:1}).toArray();
      res.send(result);
    });
    app.get('/biodata', async(req,res) => {
      let query= {}
      if(req.query){
        if(req.query.sex){
          query["sex"]=req.query.sex
        }
        if(req.query.division){
          query["division"]=req.query.division
        }
        if(req.query.age){
          query["age"]= {$lte: req.query.age}
        }        
      }
      const result = await biodatasCollection.find(query).toArray();
      res.send(result);      
    });
    
    app.get('/biodata/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await biodatasCollection.findOne(query);
      res.send(result);
    });
    app.post('/biodatas', async (req, res) => {
      const biodata = req.body;
      const result = await biodatasCollection.insertOne(biodata);
      res.send(result);
    })

    app.post('/favourite', async (req, res) => {
      const  favourite = req.body;
      const result = await favouriteCollection.insertOne(favourite);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req,res) =>{
    res.send('server is running')
})

app.listen(port,(res,req) => {
    console.log(`server is running at ${port}`)
})
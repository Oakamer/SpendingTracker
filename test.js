const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
//const { MongoClient } = require('mongodb');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());
//const uri = "mongodb+srv://u230351:cs230@cluster0.nuzoses.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const url = 'mongodb://localhost:27017';
const dbName = 'SpendDataBase';

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() { //Connects to database.
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

const db = client.db(dbName);
const spendData = db.collection('SpendData');
const chartData = db.collection('chartData');
//mongoose.connect('mongodb://localhost:8080/reactdata', { useNewUrlParser: true });




app.get("/addSpend", (req, res) => {
  res.send("GET request to /addSpend received");
});
app.get("/", (req, res) => {
  res.send("Hello World! This is the root page.");
});

app.post("/addSpend", async(req, res) => {

    try {
      const { amountSpent, spendDate, spendType } = req.body;
        //const collection = db.collection('SpendDataBase');

        const result = await spendData.insertOne({ amountSpent, spendDate, spendType });
    
        if (result.acknowledged) {
          console.log("Spend Data Inserted!");
          res.status(200).send({ message: "The spend is inserted into the collection" });
        } else {
          res.status(500).send({ message: "Failed to insert spend" });
        }
      } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send({ message: "An error occurred", error });
      }
});
app.post("/saveDataPoints", async(req, res) => {

  try {
    const {dataPoints} = req.body;
      //const collection = db.collection('SpendDataBase');

      const result = await db.collection('chartData').insertMany(dataPoints);
  
      if (result.acknowledged) {
        console.log("Chart Data Inserted!");
        res.status(200).send({ message: "The chart is inserted into the collection" });
      } else {
        res.status(500).send({ message: "Failed to insert spend" });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).send({ message: "An error occurred", error });
    }
});

app.get('/chartData', function(req, res)
{
  console.log("zzzzzz");
  db.collection('chartData').find().sort({ createdAt: -1 }).limit(7).toArray(function(err, docs) {
    if (err) {
      console.error('Error retrieving data from MongoDB:', err);
      return res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
    res.json(docs);
  });
});

const GetData = async function fetchLatestValues() {

  try {
      const database = client.db('SpendDataBase'); // Replace with your database name
      const collection = database.collection('chartData'); // Replace with your collection name

      // Step 2: Fetch the latest 7 documents
      // Assuming each document has a field named 'timestamp' indicating when it was added
      const latestDocuments = await collection.find().sort({ _id: -1 }).limit(7).toArray();

      // Step 3: Save the results to a variable
      const latestValues = latestDocuments;

      // Optional: Print the latest values
      console.log(latestValues);

      return "Hello World";
  } catch (error) {
      console.error(error);
  } finally {
      //await //client.close();
  }
}



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

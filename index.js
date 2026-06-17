const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");


dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


const uri = process.env.MONGODB_URI;

console.log("MONGODB_URI =", uri); 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connected successfully");
 } finally {
    // await client.close();
  }
}

run();

app.get("/", (req, res) => {
  res.send("Server running fine");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
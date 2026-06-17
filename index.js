const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;

const app = express();


const PORT = 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running fine");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


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



const JWKS = createRemoteJWKSet(
  new URL("http://localhost:3000/api/auth/jwks")
)

async function run() {
  try {
    await client.connect();

    const db = client.db("doc-appoint");
    const doctorCollection = db.collection("doctors");

    const bookingCollection = db.collection("bookings");

    app.post('/booking', async (req, res) => {
  const bookingData = req.body;

  if (!bookingData.userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required"
    });
  }

  const result = await bookingCollection.insertOne({
    ...bookingData,
     userId: bookingData.userId, 
    createdAt: new Date()
  });

  res.json({
    success: true,
    insertedId: result.insertedId,
  });
});

     app.get('/booking/:userId', async(req,res) => {
      const {userId} = req.params

      const result = await bookingCollection.find({userId: userId}).toArray();

      res.json(result)
    })
    app.patch('/booking/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  const updateData = req.body;

  const result = await bookingCollection.updateOne(
    { _id: new ObjectId(bookingId) },
    { $set: updateData }
  );

  res.json(result);
});

    app.delete('/booking/:bookingId' , async(req,res) => {
      const {bookingId} = req.params
      const result = await bookingCollection.deleteOne({_id: new ObjectId(bookingId)})

      res.json(result)
    })

   app.get('/appointments',async (req,res) => {
    const result = await doctorCollection.find().toArray();



    res.json(result)
   })

   app.get("/appointments/book",async(req,res) => {
    const result = await bookingCollection.find().toArray();

    res.json(result)
   })


   
    app.get("/appointments/:id", async (req, res) => {
      const { id } = req.params;
      const result = await doctorCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

   




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
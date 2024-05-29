const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
const userName = process.env.MONGO_USERNAME || "newUser31";
const password = process.env.MONGO_PASSWORD || "newUser32";

// MongoDB connection
const mongoUrl = `mongodb+srv://${userName}:${password}@cluster0.v5bevdc.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a schema and model
const recordSchema = new mongoose.Schema({
  name: String,
  value: Number,
});

const Record = mongoose.model("Record", recordSchema);

// Endpoint to add a record
app.post("/records", async (req, res) => {
  const { name, value } = req.body;
  const record = new Record({ name, value });
  try {
    const savedRecord = await record.save();
    res.status(201).send(savedRecord);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint to get all records
app.get("/records", async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).send(records);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/", async (req, res) => {
  try {
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

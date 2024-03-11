// Importing node.js modules
const express = require("express");
const admin = require("firebase-admin");
const { Storage } = require('@google-cloud/storage');

// Creates an instance of the express server
const app = express();

// Set the Google Cloud Storage credentials file path
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./files/downloaded_gcp_json_file.json";

// Initialize Firebase Admin SDK
const serviceAccount = require("./files/downloaded_firebase_json_file.json.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project-default-rtdb.firebaseio.com/",
});

// Initialize Google Cloud Storage
const storage = new Storage();
const bucket = storage.bucket("todos-vt");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Routing configurations
app.use(require("./routers/todo"));
app.use(require("./routers/index"));

app.listen(8000, () => console.log("Server started listening on port: 8000"));

// Importing node.js modules
const express = require("express");
const admin = require("firebase-admin");
const { Storage } = require('@google-cloud/storage');

// Creates an instance of the express server
const app = express();

// Set the Google Cloud Storage credentials file path
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./files/similarity-finder-a0a36122f445.json";

// Initialize Firebase Admin SDK
const serviceAccount = require("./files/nodejs-2dde3-firebase-adminsdk-o8g8o-3e5b4b30ff.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodejs-2dde3-default-rtdb.firebaseio.com/",
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

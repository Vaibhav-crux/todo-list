const express = require("express");
const admin = require("firebase-admin");

const app = express();

const serviceAccount = require("./files/nodejs-ace4f-firebase-adminsdk-7f7xr-08b1f5c3d3.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodejs-ace4f-default-rtdb.asia-southeast1.firebasedatabase.app",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(require("./routers/todo"));
app.use(require("./routers/index"));

app.listen(8000, () => console.log("Server started listening on port: 8000"));

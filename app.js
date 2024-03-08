const express = require("express");
const admin = require("firebase-admin");

const app = express();

const serviceAccount = require("./files/your_firebase_json_file.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your_firebase_database_url.firebasedatabase.app",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(require("./routers/todo"));
app.use(require("./routers/index"));

app.listen(8000, () => console.log("Server started listening on port: 8000"));

/**
 * Module dependencies.
 * @module app
 */

const express = require("express");
const admin = require("firebase-admin");

/**
 * Express application.
 * @const
 * @type {Function}
 */
const app = express();

/**
 * Firebase Admin SDK service account configuration.
 * @const
 * @type {Object}
 */
const serviceAccount = require("./files/nodejs-ace4f-firebase-adminsdk-7f7xr-08b1f5c3d3.json");

/**
 * Initialize Firebase Admin SDK.
 * @function
 * @param {Object} credential - Firebase Admin SDK credential.
 * @param {string} credential.cert - Path to the service account key file.
 * @param {string} databaseURL - Firebase Realtime Database URL.
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodejs-ace4f-default-rtdb.asia-southeast1.firebasedatabase.app",
});

/**
 * Middleware to parse URL-encoded bodies.
 * @function
 * @param {Object} options - Options for URL-encoded body parsing.
 * @param {boolean} options.extended - Enable extended URL-encoded body parsing.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Serve static files from the 'public' directory.
 * @function
 * @param {string} path - Path to the static directory.
 */
app.use(express.static("public"));

/**
 * Set the view engine to EJS.
 * @function
 * @param {string} engine - View engine to be set.
 */
app.set("view engine", "ejs");

/**
 * Use the 'todo' router for handling todo-related routes.
 * @function
 * @param {Object} router - Router for todo-related routes.
 */
app.use(require("./routers/todo"));

/**
 * Use the 'index' router for handling index-related routes.
 * @function
 * @param {Object} router - Router for index-related routes.
 */
app.use(require("./routers/index"));

/**
 * Start the server and listen on port 8000.
 * @function
 * @param {number} port - Port number to listen on.
 * @param {Function} callback - Callback function to be executed on server start.
 */
app.listen(8000, () => console.log("Server started listening on port: 8000"));

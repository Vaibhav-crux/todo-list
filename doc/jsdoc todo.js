/**
 * Express Router for handling todo-related routes.
 * @module routers/todo
 */

const router = require('express').Router();
const admin = require("firebase-admin");

/**
 * Route handling GET request for the root path ("/").
 * Retrieves todos from Firestore and renders the 'index' view with todo data.
 * @function
 * @name get/
 * @memberof module:routers/todo
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.get("/", async (req, res) => {
    try {
        const firestore = admin.firestore();
        const todosSnapshot = await firestore.collection("todos").get();
        const todos = todosSnapshot.docs.map(doc => doc.data());

        res.render("index", { todos });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * Route handling POST request to add a new todo ("/add/todo").
 * Adds a new todo to Firestore and redirects to the root path.
 * @function
 * @name post/add/todo
 * @memberof module:routers/todo
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.post("/add/todo", async (req, res) => {
    try {
        const { todo } = req.body;

        const firestore = admin.firestore();
        const todoRef = firestore.collection("todos").doc();
        await todoRef.set({
            todo: todo,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Successfully added to Firestore");
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * Route handling POST request to delete a todo ("/delete/todo").
 * Deletes a todo from Firestore based on the provided todo data and redirects to the root path.
 * @function
 * @name post/delete/todo
 * @memberof module:routers/todo
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.post("/delete/todo", async (req, res) => {
    try {
        const { todo } = req.body;

        if (!todo) {
            throw new Error("Invalid todo data");
        }

        const firestore = admin.firestore();
        const todosCollection = firestore.collection("todos");
        
        const querySnapshot = await todosCollection.where("todo", "==", todo).get();

        querySnapshot.forEach(doc => {
            doc.ref.delete();
        });

        console.log("Successfully deleted from Firestore");
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * Module exports the router for todo-related routes.
 * @exports router
 */
module.exports = router;

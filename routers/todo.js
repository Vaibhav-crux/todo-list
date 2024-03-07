const router = require('express').Router();
const admin = require("firebase-admin");

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


module.exports = router;

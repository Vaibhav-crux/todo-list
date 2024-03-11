const router = require('express').Router();
const admin = require("firebase-admin");
const multer = require("multer");
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket("todos-vt");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for file size, adjust as needed
  },
});

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

router.post("/add/todo", upload.single("file"), async (req, res) => {
    try {
      const { todo } = req.body;
  
      const firestore = admin.firestore();
      const todoRef = firestore.collection("todos").doc();
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
  
      // Save text data
      await todoRef.set({
        todo,
        timestamp,
      });
  
      // Save image to GCP bucket
      if (req.file) {
        const file = bucket.file(`${todoRef.id}_${req.file.originalname}`);
        const stream = file.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });
  
        stream.end(req.file.buffer);
  
        // Wait for the stream to finish
        await new Promise((resolve, reject) => {
          stream.on('finish', resolve);
          stream.on('error', reject);
        });
  
        // Update the Firestore document with image URL
        const [fileMetadata] = await file.getMetadata();
        const imageUrl = fileMetadata.mediaLink;
  
        // Update Firestore document with both imageUrl and file_url
        await todoRef.update({
          imageUrl,
          file_url: imageUrl, // Add the file_url field in Firestore
        });
      }
  
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

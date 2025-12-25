const express = require("express");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} = require("firebase/firestore");

const app = express();
app.use(express.json());

const firebaseConfig = {
  apiKey: "AIzaSyBE4iy1F8SUjpKcv3tpIi3VE5pixvxIaTk",
  authDomain: "b0-pro.firebaseapp.com",
  projectId: "b0-pro",
  storageBucket: "b0-pro.firebasestorage.app",
  messagingSenderId: "365201811616",
  appId: "1:365201811616:web:564942962a802dac71c1c5",
  measurementId: "G-V3E11TYNKD",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.post("/api/index", async (req, res) => {
  try {
    const messageText = req.body.message ? req.body.message.text : "";
    console.log("សារទទួលបាន:", messageText);
    
    if (messageText.includes("9.99")) {
      const paymentQuery = query(
        collection(db, "payments"), 
        where("status", "==", "pending"),
        where("amount", "==", 9.99)
      );

      const querySnapshot = await getDocs(paymentQuery);

      if (querySnapshot.empty) {
        console.log("រកមិនឃើញទិន្នន័យដែលត្រូវគ្នាទេ");
        return res.status(200).send("No matching payment");
      }

      for (const docSnap of querySnapshot.docs) {
        await updateDoc(docSnap.ref, {
          status: "paid",
          updatedAt: new Date(),
        });
      }
      return res.status(200).send("Updated Successfully");
    }
    res.status(200).send("Not 9.99 message");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;

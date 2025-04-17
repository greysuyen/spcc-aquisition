const express = require('express');
const requestIp = require('request-ip');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://YOUR_FIREBASE_PROJECT_ID.firebaseio.com"
});

const db = admin.firestore();
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON body

// Route to handle tracking of user IPs
app.post('/track-user', (req, res) => {
    const userIp = requestIp.getClientIp(req); // Get IP address from request
    const { userId, userEmail } = req.body; // Extract user data

    // Log the user IP, email, and UID to the database
    db.collection('user_ips').add({
        userId,
        userEmail,
        ip: userIp,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        res.json({ message: "User IP logged successfully", ip: userIp });
    })
    .catch(error => {
        console.error("Error logging user IP:", error);
        res.status(500).json({ message: "Failed to log user IP" });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
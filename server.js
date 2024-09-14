const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let users = {};

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, descriptor } = req.body;
    if (users[username]) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users[username] = descriptor;
    res.status(200).json({ message: 'Registration successful' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, descriptor } = req.body;
    const savedDescriptor = users[username];
    if (!savedDescriptor) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }

    const distance = faceapi.euclideanDistance(descriptor, savedDescriptor);
    if (distance < 0.6) {
        return res.json({ success: true });
    } else {
        return res.json({ success: false, message: 'Face does not match' });
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

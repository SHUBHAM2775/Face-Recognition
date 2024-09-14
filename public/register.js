document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('camera');
    const errorMessage = document.getElementById('error-message');

    // Load face-api.js models
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]).then(() => {
        console.log("Face-api.js models loaded successfully");
    }).catch(err => {
        console.error('Failed to load models:', err);
    });

    // Start camera when button is clicked
    document.getElementById('start-camera').addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (error) {
            errorMessage.textContent = 'Error starting camera: ' + error.message;
        }
    });

    // Register form submission
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;

        const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        if (!detection) {
            errorMessage.textContent = 'No face detected. Please try again.';
            return;
        }

        const descriptor = detection.descriptor;
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, descriptor })
        }).then(res => {
            if (res.ok) {
                alert('Registration successful!');
                window.location.href = '/login.html';
            } else {
                errorMessage.textContent = 'Registration failed.';
            }
        });
    });
});

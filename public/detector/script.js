import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let preview = document.getElementById('preview');
let captureButton = document.getElementById('capture');
let resultDiv = document.getElementById('result');

// Start camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing camera:", err);
        resultDiv.textContent = "Error: Could not access camera";
    }
}

// Initialize Gradio client
async function initGradio() {
    try {
        return await Client("https://tonywilliamsdev-happy-or-sad.hf.space/");
    } catch (error) {
        console.error("Error initializing Gradio client:", error);
        throw error;
    }
}

// Capture photo
async function capturePhoto() {
    try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        // Display preview
        const imageData = canvas.toDataURL('image/jpeg');
        preview.innerHTML = `<img src="${imageData}" style="max-width: 300px;">`;
        
        resultDiv.textContent = "Analyzing...";
        
        // Convert to blob
        const response = await fetch(imageData);
        const blob = await response.blob();
        
        // Send to Gradio
        const app = await Client.connect("tonywilliamsdev/happy-or-sad");
        console.log(app);
        const result = await app.predict("/predict", {
            img: blob
        });

        console.log(result);
        
        resultDiv.textContent = `Result: ${result.data[0]}`;
    } catch (error) {
        console.error("Error:", error);
        resultDiv.textContent = "Error analyzing image";
    }
}

// Set up event listeners
captureButton.addEventListener('click', capturePhoto);

// Start camera when page loads
startCamera(); 
# Facial Emotion Recognizer

A simple web application that uses TinyFace models to dynamically interpret facial emotions from a webcam feed and adjust the background color of the HTML page accordingly.

## Features

- Uses TinyFace AI models to detect facial emotions in real-time.
- Dynamically changes the background color based on detected emotions.
- Lightweight and runs entirely in the browser.
- Utilizes HTML, CSS, and JavaScript.

## Technologies Used

- **HTML**: Structuring the webpage.
- **CSS**: Styling and background transitions.
- **JavaScript**: Handling face detection and updating the UI.
- **TinyFace Model**: For facial emotion recognition.

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone [https://github.com/your-username/tinyface-emotion-bg.git](https://github.com/Greg4268/Emotion_Recognizer)
   cd Emotion_Recognizer
   ```
2. Open `index.html` in your browser.
3. Grant camera access when prompted.
4. The background will change dynamically based on your facial expressions!

## How It Works

1. The browser requests access to the user's webcam.
2. The TinyFace model processes the live feed and detects emotions.
3. Based on the detected emotion, the script changes the background color


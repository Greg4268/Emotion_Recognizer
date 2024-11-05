const video = document.getElementById("video");
const isScreenSmall = window.matchMedia("(max-width: 700px)");
let predictedAges = [];

/**** Loading the models with error handling ****/
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  //faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  //faceapi.nets.ageGenderNet.loadFromUri("/models"),
])
  .then(startVideo)
  .catch((err) => console.error("Error loading models:", err));

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error("Error accessing webcam:", err)
  );
}

/**** Adjust video width based on screen size ****/
function screenResize(isScreenSmall) {
  video.style.width = isScreenSmall.matches ? "320px" : "500px";
}
screenResize(isScreenSmall);
isScreenSmall.addListener(screenResize);

/**** Face Detection Function with Error Handling ****/
function detectFaces() {
  const canvas = faceapi.createCanvasFromMedia(video);
  video.parentNode.insertBefore(canvas, video.nextSibling);

  const updateCanvasSize = () => {
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
  };

  updateCanvasSize(); // Set initial canvas size
  window.addEventListener("resize", updateCanvasSize);

  async function onPlay() {
    let frameCount = 0;
    if (frameCount % 3 === 0) {
      try {
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
        //.withAgeAndGender();

        if (!detections) {
          console.warn("No face detected");
          requestAnimationFrame(onPlay); // Continue if no detections
          return;
        }

        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Only draw if detections exist
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        // Update DOM with values
        const { age, gender, expressions } = resizedDetections;
        //const interpolatedAge = interpolateAgePredictions(age);
        const maxExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        //document.getElementById("age").innerText = `Age - ${interpolatedAge}`;
        //document.getElementById("gender").innerText = `Gender - ${gender}`;
        document.getElementById(
          "emotion"
        ).innerText = `Emotion - ${maxExpression}`;

        // Set background color based on detected emotion
        const body = document.body;
        switch (maxExpression) {
          case "happy":
            body.style.backgroundColor = "#78d966";
            break;
          case "neutral":
            body.style.backgroundColor = "#a6a39e";
            break;
          case "sad":
            body.style.backgroundColor = "#3349aa";
            break;
          case "surprised":
            body.style.backgroundColor = "yellow";
            break;
          case "angry":
            body.style.backgroundColor = "#e74f4f";
            break;
          default:
            body.style.backgroundColor = "white"; // Default for unlisted emotions
            break;
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      }
    }
    frameCount++;
    requestAnimationFrame(onPlay); // Continue loop
  }

  requestAnimationFrame(onPlay);
}

video.addEventListener("playing", detectFaces);

// age prediction - removed for speed
// function interpolateAgePredictions(age) {
//   predictedAges = [age].concat(predictedAges).slice(0, 15);
//   const avgPredictedAge =
//     predictedAges.reduce((total, a) => total + a) / predictedAges.length;
//   return avgPredictedAge;
// }

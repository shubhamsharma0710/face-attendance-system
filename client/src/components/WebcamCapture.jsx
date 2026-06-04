import Webcam from "react-webcam";

export default function WebcamCapture() {
  return (
    <div>
      <h1>Face Attendance System</h1>

      <Webcam
        audio={false}
        width={640}
        height={480}
        screenshotFormat="image/jpeg"
      />

      <p>Webcam Component Loaded</p>
    </div>
  );
}
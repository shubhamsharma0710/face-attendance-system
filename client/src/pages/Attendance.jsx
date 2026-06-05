import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";
import API from "../config";

export default function Attendance() {
  const webcamRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] =
    useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(
        MODEL_URL + "/tiny_face_detector"
      );

      await faceapi.nets.faceLandmark68Net.loadFromUri(
        MODEL_URL + "/face_landmark_68"
      );

      await faceapi.nets.faceRecognitionNet.loadFromUri(
        MODEL_URL + "/face_recognition"
      );

      setModelsLoaded(true);

      console.log(
        "✅ FaceAPI Models Loaded"
      );
    } catch (error) {
      console.error(
        "Model Loading Error:",
        error
      );
    }
  };

  const markAttendance = async () => {
    try {
      const employeeRes =
        await axios.get(
          `${API}/api/employees/all`
        );

      const employees =
        employeeRes.data;

      if (
        !employees ||
        employees.length === 0
      ) {
        alert(
          "No Employee Registered"
        );
        return;
      }

      const video =
        webcamRef.current?.video;

      if (
        !video ||
        video.readyState !== 4
      ) {
        alert("Camera Not Ready");
        return;
      }

      const detection =
        await faceapi
          .detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions(
              {
                inputSize: 416,
                scoreThreshold:
                  0.1,
              }
            )
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

      if (!detection) {
        alert("No Face Found");
        return;
      }

      const currentDescriptor =
        detection.descriptor;

      let matchedEmployee =
        null;

      let minDistance = 999;

      employees.forEach(
        (employee) => {
          const storedDescriptor =
            new Float32Array(
              employee.descriptor
            );

          const distance =
            faceapi.euclideanDistance(
              currentDescriptor,
              storedDescriptor
            );

          if (
            distance <
            minDistance
          ) {
            minDistance =
              distance;

            matchedEmployee =
              employee;
          }
        }
      );

      console.log(
        "Matched Employee:",
        matchedEmployee
      );

      console.log(
        "Face Distance:",
        minDistance
      );

      if (
        !matchedEmployee ||
        minDistance > 0.5
      ) {
        alert(
          "Unknown Person"
        );
        return;
      }

      const now =
        new Date();

      const hour =
        now.getHours();

      const minute =
        now.getMinutes();

      let status =
        "Present";

      if (
        hour < 10 ||
        (hour === 10 &&
          minute === 0)
      ) {
        status =
          "Present";
      } else if (
        hour === 10 &&
        minute <= 30
      ) {
        status =
          "Late";
      } else {
        status =
          "Absent";
      }

      const attendanceData =
        {
          employeeId:
            matchedEmployee._id,
          status,
          checkInTime:
            now.toLocaleTimeString(),
        };

      console.log(
        "Attendance Payload:",
        attendanceData
      );

      const response =
        await axios.post(
          `${API}/api/attendance/mark`,
          attendanceData
        );

      console.log(
        "Attendance Saved:",
        response.data
      );

      alert(
        `${matchedEmployee.employeeName}

Status: ${status}

${response.data.message}`
      );
    } catch (error) {
      console.error(
        "Attendance Error:",
        error
      );

      if (
        error.response?.data
          ?.message
      ) {
        alert(
          error.response.data
            .message
        );
      } else {
        alert(
          "Attendance Failed"
        );
      }
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        minHeight: "100vh",
        backgroundColor:
          "#0f172a",
        color: "white",
      }}
    >
      <h1>
        Face Attendance
        System
      </h1>

      {!modelsLoaded ? (
        <h2>
          Loading Models...
        </h2>
      ) : (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            screenshotFormat="image/jpeg"
            width={700}
            height={500}
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode:
                "user",
            }}
          />

          <br />
          <br />

          <button
            onClick={
              markAttendance
            }
            style={{
              padding:
                "12px 24px",
              fontSize:
                "16px",
              cursor:
                "pointer",
              border:
                "none",
              borderRadius:
                "8px",
              backgroundColor:
                "#2563eb",
              color:
                "white",
            }}
          >
            Mark Attendance
          </button>
        </>
      )}
    </div>
  );
}
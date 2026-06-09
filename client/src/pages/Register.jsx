import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import API from "../config";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";

export default function Register() {
  const webcamRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] =
    useState(false);

  const [employeeId, setEmployeeId] =
    useState("");

  const [
    employeeName,
    setEmployeeName,
  ] = useState("");

  const [email, setEmail] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [
    department,
    setDepartment,
  ] = useState("");

  const [
    designation,
    setDesignation,
  ] = useState("");

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(
        MODEL_URL +
          "/tiny_face_detector"
      );

      await faceapi.nets.faceLandmark68Net.loadFromUri(
        MODEL_URL +
          "/face_landmark_68"
      );

      await faceapi.nets.faceRecognitionNet.loadFromUri(
        MODEL_URL +
          "/face_recognition"
      );

      setModelsLoaded(true);

      console.log(
        "✅ Models Loaded"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const registerEmployee =
    async () => {
      try {
        if (
          !employeeId ||
          !employeeName
        ) {
          alert(
            "Employee ID and Name are required"
          );
          return;
        }

        const company =
          JSON.parse(
            localStorage.getItem(
              "company"
            )
          );

        if (!company) {
          alert(
            "Company Not Found. Please Login Again."
          );
          return;
        }

        const video =
          webcamRef.current?.video;

        if (
          !video ||
          video.readyState !== 4
        ) {
          alert(
            "Camera Not Ready"
          );
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
          alert(
            "Face Not Detected"
          );
          return;
        }

        const employee = {
          companyId:
            company._id,

          employeeId,

          employeeName,

          email,

          mobile,

          department,

          designation,

          descriptor:
            Array.from(
              detection.descriptor
            ),
        };

        const response =
          await axios.post(
            `${API}/api/employees/register`,
            employee
          );

        alert(
          response.data.message ||
            "Employee Registered Successfully"
        );

        setEmployeeId("");
        setEmployeeName("");
        setEmail("");
        setMobile("");
        setDepartment("");
        setDesignation("");
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data
            ?.message ||
            "Registration Failed"
        );
      }
    };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1>
        Employee Registration
      </h1>

      {!modelsLoaded ? (
        <h2>
          Loading Models...
        </h2>
      ) : (
        <>
          <input
            type="text"
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) =>
              setEmployeeId(
                e.target.value
              )
            }
            style={{
              width: "300px",
              padding: "10px",
              margin: "5px",
            }}
          />

          <br />

          <input
            type="text"
            placeholder="Employee Name"
            value={employeeName}
            onChange={(e) =>
              setEmployeeName(
                e.target.value
              )
            }
            style={{
              width: "300px",
              padding: "10px",
              margin: "5px",
            }}
          />

          <br />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            style={{
              width: "300px",
              padding: "10px",
              margin: "5px",
            }}
          />

          <br />

          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) =>
              setMobile(
                e.target.value
              )
            }
            style={{
              width: "300px",
              padding: "10px",
              margin: "5px",
            }}
          />

          <br />

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) =>
              setDepartment(
                e.target.value
              )
            }
            style={{
              width: "300px",
              padding: "10px",
              margin: "5px",
            }}
          />

          <br />

          <input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) =>
              setDesignation(
                e.target.value
              )
            }
            style={{
              width: "300px",
              padding: "10px",
              margin: "5px",
            }}
          />

          <br />
          <br />

          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            width={700}
            height={500}
            screenshotFormat="image/jpeg"
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
              registerEmployee
            }
            style={{
              padding:
                "12px 24px",
              fontSize:
                "16px",
              cursor:
                "pointer",
            }}
          >
            Register Employee
          </button>
        </>
      )}
    </div>
  );
}
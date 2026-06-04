import { useState } from "react";
import axios from "axios";
import { API } from "../config";
export default function Login({
  onLogin,
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async () => {
      try {
        setLoading(true);

        const response =
          await axios.post(
            `${API}/api/company/login`,
            {
              email,
              password,
            }
          );

        localStorage.setItem(
          "isLoggedIn",
          "true"
        );

        localStorage.setItem(
          "company",
          JSON.stringify(
            response.data.company
          )
        );

        alert(
          response.data.message
        );

        onLogin();
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data
            ?.message ||
            "Login Failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        height: "100vh",
        background:
          "#0f172a",
      }}
    >
      <div
        style={{
          width: "420px",
          background:
            "#1e293b",
          padding: "30px",
          borderRadius:
            "12px",
          color: "white",
          textAlign:
            "center",
          boxShadow:
            "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        <h1>
          Company Login
        </h1>

        <p>
          Face Attendance
          System
        </p>

        <input
          type="email"
          placeholder="Company Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius:
              "6px",
            border:
              "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius:
              "6px",
            border:
              "1px solid #ccc",
          }}
        />

        <button
          onClick={
            handleLogin
          }
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            background:
              "#2563eb",
            color:
              "white",
            border: "none",
            borderRadius:
              "6px",
            cursor:
              "pointer",
            fontSize:
              "16px",
          }}
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>

        <div
          style={{
            marginTop:
              "20px",
            fontSize:
              "14px",
            color:
              "#cbd5e1",
          }}
        >
          Company Based Face
          Attendance System
        </div>
      </div>
    </div>
  );
}
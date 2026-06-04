import React, {
useState,
} from "react";
import { API } from "../config";
import axios from "axios";

export default function SuperAdminLogin({
onLogin,
}) {
const [username, setUsername] =
useState("");

const [password, setPassword] =
useState("");

const handleLogin =
async () => {
try {
const response =
await axios.post(
`${API}/api/superadmin/login`,
{
username,
password,
}
);


    localStorage.setItem(
      "superAdminLoggedIn",
      "true"
    );

    localStorage.setItem(
      "superAdmin",
      JSON.stringify(
        response.data.superAdmin
      )
    );

    alert(
      "Super Admin Login Successful"
    );

    onLogin();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data
        ?.message ||
        "Login Failed"
    );
  }
};


return (
<div
style={{
textAlign: "center",
marginTop: "100px",
}}
> <h1>
Super Admin Login </h1>


  <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) =>
      setUsername(
        e.target.value
      )
    }
    style={{
      width: "300px",
      padding: "10px",
      margin: "10px",
    }}
  />

  <br />

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
      width: "300px",
      padding: "10px",
      margin: "10px",
    }}
  />

  <br />

  <button
    onClick={handleLogin}
    style={{
      padding: "10px 20px",
      cursor: "pointer",
    }}
  >
    Login
  </button>
</div>


);
}

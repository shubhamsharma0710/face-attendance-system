import React, { useState } from "react";
import axios from "axios";
import API from "../config";

export default function CreateCompany() {
  const [formData, setFormData] = useState({
    companyName: "",
    adminName: "",
    email: "",
    password: "",
    plan: "Monthly",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createCompany = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/api/company/create`,
        formData
      );

      alert(
        response.data.message ||
          "Company Created Successfully"
      );

      setFormData({
        companyName: "",
        adminName: "",
        email: "",
        password: "",
        plan: "Monthly",
        expiryDate: "",
      });
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to Create Company"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Create Company
      </h1>

      <form onSubmit={createCompany}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="text"
          name="adminName"
          placeholder="Admin Name"
          value={formData.adminName}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="off"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Admin Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <select
          name="plan"
          value={formData.plan}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Half-Yearly">Half-Yearly</option>
          <option value="Yearly">Yearly</option>
        </select>

        <label>Expiry Date</label>

        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Creating..."
            : "Create Company"}
        </button>
      </form>
    </div>
  );
}
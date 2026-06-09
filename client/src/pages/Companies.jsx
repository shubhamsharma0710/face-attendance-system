import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import API from "../config";

export default function Companies() {
  const [companies, setCompanies] =
    useState([]);

  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [expiryDate, setExpiryDate] =
    useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${API}/api/company/all`
      );

      setCompanies(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCompany = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete Company?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API}/api/company/delete/${id}`
      );

      alert(
        "Company Deleted Successfully"
      );

      fetchCompanies();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

  const disableCompany =
    async (id) => {
      try {
        await axios.put(
          `${API}/api/company/disable/${id}`
        );

        alert(
          "Company Disabled"
        );

        fetchCompanies();
      } catch (error) {
        console.error(error);
      }
    };

  const enableCompany =
    async (id) => {
      try {
        await axios.put(
          `${API}/api/company/enable/${id}`
        );

        alert(
          "Company Enabled"
        );

        fetchCompanies();
      } catch (error) {
        console.error(error);
      }
    };

  const renewCompany = async () => {
    try {
      if (!selectedCompany) return;

      if (!expiryDate) {
        alert(
          "Please Select Expiry Date"
        );
        return;
      }

      const response =
        await axios.put(
          `${API}/api/company/renew/${selectedCompany}`,
          {
            expiryDate,
          }
        );

      alert(
        response.data.message
      );

      setSelectedCompany(null);
      setExpiryDate("");

      fetchCompanies();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Renew Failed"
      );
    }
  };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Manage Companies
      </h1>

      {selectedCompany && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>
            Renew Subscription
          </h3>

          <input
            type="date"
            value={expiryDate}
            onChange={(e) =>
              setExpiryDate(
                e.target.value
              )
            }
            style={{
              padding: "8px",
              marginRight: "10px",
            }}
          />

          <button
            onClick={renewCompany}
          >
            Save
          </button>

          <button
            onClick={() => {
              setSelectedCompany(
                null
              );

              setExpiryDate("");
            }}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse:
            "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>
              Company Name
            </th>
            <th>
              Admin Name
            </th>
            <th>Email</th>
            <th>Plan</th>
            <th>
              Expiry Date
            </th>
            <th>Status</th>
            <th>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {companies.map(
            (
              company,
              index
            ) => (
              <tr
                key={
                  company._id
                }
              >
                <td>
                  {index + 1}
                </td>

                <td>
                  {
                    company.companyName
                  }
                </td>

                <td>
                  {
                    company.adminName
                  }
                </td>

                <td>
                  {company.email}
                </td>

                <td>
                  {company.plan}
                </td>

                <td>
                  {company.expiryDate
                    ? new Date(
                        company.expiryDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  {company.isActive
                    ? "Active"
                    : "Disabled"}
                </td>

                <td>
                  <button
                    onClick={() => {
                      setSelectedCompany(
                        company._id
                      );

                      setExpiryDate(
                        company.expiryDate
                          ? new Date(
                              company.expiryDate
                            )
                              .toISOString()
                              .split(
                                "T"
                              )[0]
                          : ""
                      );
                    }}
                  >
                    Renew
                  </button>

                  <button
                    onClick={() =>
                      enableCompany(
                        company._id
                      )
                    }
                    style={{
                      marginLeft:
                        "5px",
                    }}
                  >
                    Enable
                  </button>

                  <button
                    onClick={() =>
                      disableCompany(
                        company._id
                      )
                    }
                    style={{
                      marginLeft:
                        "5px",
                    }}
                  >
                    Disable
                  </button>

                  <button
                    onClick={() =>
                      deleteCompany(
                        company._id
                      )
                    }
                    style={{
                      marginLeft:
                        "5px",
                      backgroundColor:
                        "red",
                      color:
                        "white",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
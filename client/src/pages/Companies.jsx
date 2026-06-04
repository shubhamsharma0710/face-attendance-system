import React, {
useEffect,
useState,
} from "react";

import axios from "axios";

export default function Companies() {
const [companies, setCompanies] =
useState([]);

useEffect(() => {
fetchCompanies();
}, []);

const fetchCompanies =
async () => {
try {
const response =
await axios.get(
"http://localhost:5000/api/superadmin/companies"
);


    setCompanies(
      response.data
    );
  } catch (error) {
    console.error(error);
  }
};


const deleteCompany =
async (id) => {
const confirmDelete =
window.confirm(
"Delete Company?"
);


  if (!confirmDelete)
    return;

  try {
    await axios.delete(
      `http://localhost:5000/api/superadmin/company/${id}`
    );

    alert(
      "Company Deleted Successfully"
    );

    fetchCompanies();
  } catch (error) {
    console.error(error);
  }
};


const disableCompany =
async (id) => {
try {
await axios.put(
`http://localhost:5000/api/superadmin/disable/${id}`
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
`http://localhost:5000/api/superadmin/enable/${id}`
);


    alert(
      "Company Enabled"
    );

    fetchCompanies();
  } catch (error) {
    console.error(error);
  }
};


const renewCompany =
async (id) => {
try {
const newDate =
prompt(
"Enter New Expiry Date (YYYY-MM-DD)"
);


    if (!newDate)
      return;

    await axios.put(
      `http://localhost:5000/api/superadmin/renew/${id}`,
      {
        expiryDate:
          newDate,
      }
    );

    alert(
      "Subscription Renewed"
    );

    fetchCompanies();
  } catch (error) {
    console.error(error);
  }
};


return (
<div
style={{
padding: "20px",
}}
> <h1>
Manage Companies </h1>


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
              {new Date(
                company.expiryDate
              ).toLocaleDateString()}
            </td>

            <td>
              {company.isActive
                ? "Active"
                : "Disabled"}
            </td>

            <td>
              <button
                onClick={() =>
                  renewCompany(
                    company._id
                  )
                }
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

"use client";

import { useEffect, useState } from "react";
import "../styles/license.css";
import Link from "next/link";

type License = {
  id: number;
  license_key: string;
  account_number: number;
  plan_name: string;
  full_name: string;
  status: string;

  created_at: string;
  expire_date: string;
};

type Customer = {
  id: number;
  full_name: string;
};

type Plan = {
  id: number;
  name: string;
};

export default function LicensesPage() {
const [licenses, setLicenses] = useState<License[]>([]);
const [showModal, setShowModal] = useState(false);
const [customers, setCustomers] = useState<Customer[]>([]);
const [selectedCustomer, setSelectedCustomer] = useState("");
const [plans, setPlans] = useState<Plan[]>([]);
const [selectedPlan, setSelectedPlan] = useState("1");
const [accountNumber, setAccountNumber] = useState("");
const [editingLicense, setEditingLicense] =
  useState<License | null>(null);
const [viewLicense, setViewLicense] =
  useState<License | null>(null);

const [editAccount, setEditAccount] = useState("");
const [editStatus, setEditStatus] = useState("");

const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] =
  useState("all");

const [currentPage, setCurrentPage] =
  useState(1);

const licensesPerPage = 10;

const now = new Date().getTime();

    const getDaysLeft = (
  expireDate: string
) => {

  return Math.ceil(
    (
      new Date(expireDate).getTime() -
      now
    ) /
    (1000 * 60 * 60 * 24)
  );

};

useEffect(() => {

  fetch("/api/licenses")
    .then((res) => res.json())
    .then((data) => {
      setLicenses(data);
    });

  fetch("/api/customers")
    .then((res) => res.json())
    .then((data) => {
      setCustomers(data.customers);

      if (data.customers?.length > 0) {
        setSelectedCustomer(
          String(data.customers[0].id)
        );
      }
    });

  fetch("/api/plans")
    .then((res) => res.json())
    .then((data) => {

      setPlans(data);

      if (data?.length > 0) {
        setSelectedPlan(
          String(data[0].id)
        );
      }

    });

}, []);

const saveLicense = async () => {

    console.log({
  selectedCustomer,
  selectedPlan,
  accountNumber,
});

const res = await fetch(
    "/api/licenses",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: selectedCustomer,
        plan_id: selectedPlan,
        account_number: accountNumber,
      }),
    }
  );

const data = await res.json();

  if (data.success) {
    alert("License Created");
    location.reload();
  } else {
    alert("Create Failed");
  }
};

const deleteLicense = async (
  id: number
) => {

const confirmDelete = confirm(
    "Delete this license?"
  );

  if (!confirmDelete) return;

const res = await fetch(
    `/api/licenses/${id}`,
    {
      method: "DELETE",
    }
  );

const data = await res.json();

  if (data.success) {

    alert("License Deleted");

    location.reload();

  } else {

    alert("Delete Failed");

  }
};

const openEditModal = (
  license: License
) => {

  setEditingLicense(license);

  setEditAccount(
    String(license.account_number)
  );

  setEditStatus(
    license.status
  );
};

const updateLicense = async () => {

  if (!editingLicense) return;

const res = await fetch(
    `/api/licenses/${editingLicense.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_number: editAccount,
        plan_id: 1,
        status: editStatus,
      }),
    }
  );

const data = await res.json();

  if (data.success) {

    alert("License Updated");

    location.reload();

  } else {

    alert("Update Failed");

  }
};

const [editPlan, setEditPlan] =
  useState("");
const filteredLicenses = licenses.filter(
  (license) => {

    const matchSearch =
      license.license_key
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      String(license.account_number)
        .includes(search) ||

      license.full_name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all"
        ? true
        : license.status ===
          statusFilter;

    return (
      matchSearch &&
      matchStatus
    );
  }
);

const activeCount = licenses.filter(
  (l) => l.status === "active"
).length;

const expiredCount = licenses.filter(
  (l) => l.status === "expired"
).length;

const disabledCount = licenses.filter(
  (l) => l.status === "disabled"
).length;

const expiringSoonCount =
  licenses.filter((license) => {

    if (!license.expire_date)
      return false;

    const daysLeft =
      getDaysLeft(
        license.expire_date
      );

    return (
      daysLeft <= 7 &&
      daysLeft >= 0
    );

  }).length;

const copyLicense = (
  id: number,
  licenseKey: string
) => {

  navigator.clipboard.writeText(
    licenseKey
  );

  setCopiedId(id);

  setTimeout(() => {
    setCopiedId(null);
  }, 2000);
};

const [copiedId, setCopiedId] =
  useState<number | null>(null);

const totalPages = Math.ceil(
  filteredLicenses.length /
  licensesPerPage
);

const startIndex =
  (currentPage - 1) *
  licensesPerPage;

const currentLicenses =
  filteredLicenses.slice(
    startIndex,
    startIndex + licensesPerPage
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020817",
        color: "white",
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >

        <div className="header-left">

        <Link href="/dashboard" className="back-btn">
            ← Back to Dashboard
        </Link>

        <span className="page-tag">
            LICENSES
        </span>

        <h1>🔑 License Management</h1>

        <p>
            Manage all licenses, plans and account binding
        </p>

<div
  style={{
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    flexWrap: "wrap",
  }}
>

  <div className="stat-card">
    Total Licenses
    <span>{licenses.length}</span>
  </div>

  <div className="stat-card">
    Active
    <span>{activeCount}</span>
  </div>

  <div className="stat-card">
    Expired
    <span>{expiredCount}</span>
  </div>

  <div className="stat-card">
    Disabled
    <span>{disabledCount}</span>
  </div>
  <div className="stat-card">
  Expiring Soon
  <span>
    {expiringSoonCount}
  </span>
</div>
</div>

        </div>

        <button
        onClick={() => setShowModal(true)}
        style={{
            background: "#00bfff",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
        }}
        >
        + Create License
        </button>
      </div>

      <div
  style={{
    marginBottom: "20px",
  }}
>

    <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  }}
>
  <input
    type="text"
    placeholder="🔍 Search license..."
    value={search}
    onChange={(e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    }}
    style={{
      width: "350px",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #1e3a5f",
      background: "#071426",
      color: "#fff",
    }}
  />

  <select
    value={statusFilter}
    onChange={(e) => {
    setStatusFilter(
        e.target.value
    );
    setCurrentPage(1);
    }}
    style={{
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #1e3a5f",
      background: "#071426",
      color: "#fff",
    }}
  >
    <option value="all">
      All Status
    </option>

    <option value="active">
      Active
    </option>

    <option value="expired">
      Expired
    </option>

    <option value="disabled">
      Disabled
    </option>
  </select>
</div>

</div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#071426",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#0c1f3f",
            }}
          >
            <th style={thStyle}>ID</th>
            <th style={thStyle}>License Key</th>
            <th style={thStyle}>Account</th>
            <th style={thStyle}>Plan</th>
            <th style={thStyle}>Owner</th>
            <th style={thStyle}>Created</th>
            <th style={thStyle}>Expire</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
            <th style={thStyle}>View</th>
            <th style={thStyle}>Copy</th>
            <th style={thStyle}>Days Left</th>
          </tr>
        </thead>

        <tbody>
          {currentLicenses.map((license) => (
            <tr key={license.id}>
              <td style={tdStyle}>{license.id}</td>
              <td style={tdStyle}>{license.license_key}</td>
              <td style={tdStyle}>{license.account_number}</td>
              <td style={tdStyle}>{license.plan_name}</td>
              <td style={tdStyle}>{license.full_name}</td>
                <td style={tdStyle}>
                {license.created_at
                    ? new Date(
                        license.created_at
                    ).toLocaleDateString()
                    : "-"
                }
                </td>

                <td style={tdStyle}>
                {license.expire_date
                    ? new Date(
                        license.expire_date
                    ).toLocaleDateString()
                    : "-"
                }
                </td>

                <td style={tdStyle}>
                <span
                    style={{
                    background:
                        license.status === "active"
                            ? "#00aa55"
                            : license.status === "expired"
                            ? "#cc3333"
                            : "#666666",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    }}
                >
                    {license.status}
                </span>
                </td>

                <td style={tdStyle}>
                <button
                    className="edit-btn"
                    onClick={() =>
                    openEditModal(license)
                    }
                >
                    Edit
                </button>

                <button
                    className="delete-btn"
                    onClick={() =>
                    deleteLicense(license.id)
                    }
                >
                    Delete
                </button>

                </td>

<td style={tdStyle}>
  <button
    className="view-btn"
    onClick={() =>
      setViewLicense(license)
    }
  >
    View
  </button>
</td>

<td style={tdStyle}>
  <button
    className="copy-btn"
    onClick={() =>
      copyLicense(
        license.id,
        license.license_key
      )
    }
  >
    {copiedId === license.id
      ? "Copied!"
      : "Copy"}
  </button>
</td>

<td style={tdStyle}>
  {license.expire_date ? (() => {

    const daysLeft =
      getDaysLeft(
        license.expire_date
      );

    return daysLeft < 0 ? (

      <span
        style={{
          color: "#ff4d4f",
          fontWeight: "bold",
        }}
      >
        Expired
      </span>

    ) : (

      <span
        style={{
          color:
            daysLeft <= 3
              ? "#ff4d4f"
              : "#00c3ff",
          fontWeight: "bold",
        }}
      >
        {daysLeft} days
      </span>

    );

  })() : (
    "-"
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>

      <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  }}
>
  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(
        currentPage - 1
      )
    }
    style={saveBtn}
  >
    Previous
  </button>

  <span
    style={{
      display: "flex",
      alignItems: "center",
    }}
  >
    Page {currentPage} / {totalPages}
  </span>

  <button
    disabled={
      currentPage === totalPages
    }
    onClick={() =>
      setCurrentPage(
        currentPage + 1
      )
    }
    style={saveBtn}
  >
    Next
  </button>
</div>

      {showModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        width: "550px",
        background: "#071426",
        padding: "25px",
        borderRadius: "12px",
        border: "1px solid #00bfff",
      }}
    >
      <h2>Create License</h2>

            <select
        style={inputStyle}
        value={selectedCustomer}
        onChange={(e) =>
            setSelectedCustomer(e.target.value)
        }
        >
        <option value="">
            Select Customer
        </option>

        {customers.map((customer) => (
            <option
            key={customer.id}
            value={customer.id}
            >
            {customer.full_name}
            </option>
        ))}
        </select>

<select
  value={selectedPlan}
  onChange={(e) =>
    setSelectedPlan(
      e.target.value
    )
  }
  style={inputStyle}
>
  {plans.map((plan) => (
    <option
      key={plan.id}
      value={plan.id}
    >
      {plan.name}
    </option>
  ))}
</select>

        <input
        placeholder="MT4/MT5 Account"
        style={inputStyle}
        value={accountNumber}
        onChange={(e) =>
            setAccountNumber(e.target.value)
        }
        />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <button
        style={saveBtn}
        onClick={saveLicense}
        >
        Save
        </button>

        <button
          onClick={() => setShowModal(false)}
          style={cancelBtn}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{editingLicense && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        width: "550px",
        background: "#071426",
        padding: "25px",
        borderRadius: "12px",
        border: "1px solid #00bfff",
      }}
    >

      <h2>Edit License</h2>

      <input
        value={editAccount}
        onChange={(e) =>
          setEditAccount(
            e.target.value
          )
        }
        style={inputStyle}
      />

      <select
        value={editStatus}
        onChange={(e) =>
          setEditStatus(
            e.target.value
          )
        }
        style={inputStyle}
      >
        <option value="active">
          Active
        </option>

        <option value="expired">
          Expired
        </option>

        <option value="disabled">
          Disabled
        </option>
      </select>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
        }}
      >

        <button
          style={saveBtn}
          onClick={updateLicense}
        >
          Save Changes
        </button>

        <button
          style={cancelBtn}
          onClick={() =>
            setEditingLicense(null)
          }
        >
          Cancel
        </button>

      </div>

    </div>
  </div>

)}

{viewLicense && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        width: "600px",
        background: "#071426",
        padding: "30px",
        borderRadius: "12px",
        border: "1px solid #00bfff",
      }}
    >
      <h2>
        License Details
      </h2>

      <p>
        <strong>ID:</strong>{" "}
        {viewLicense.id}
      </p>

      <p>
        <strong>License Key:</strong>{" "}
        {viewLicense.license_key}
      </p>

      <p>
        <strong>Owner:</strong>{" "}
        {viewLicense.full_name}
      </p>

      <p>
        <strong>Account:</strong>{" "}
        {viewLicense.account_number}
      </p>

      <p>
        <strong>Plan:</strong>{" "}
        {viewLicense.plan_name}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {viewLicense.status}
      </p>

      <button
        style={saveBtn}
        onClick={() =>
          setViewLicense(null)
        }
      >
        Close
      </button>
    </div>
  </div>
)}

    </main>
  );
}

const thStyle = {
  padding: "15px",
  textAlign: "left" as const,
};

const tdStyle = {
  padding: "15px",
  borderTop: "1px solid #10284f",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #1e3a5f",
  background: "#020817",
  color: "#fff",
};

const saveBtn = {
  background: "#00bfff",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

const cancelBtn = {
  background: "#444",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

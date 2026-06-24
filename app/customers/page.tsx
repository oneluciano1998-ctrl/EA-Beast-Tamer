"use client";

import { useEffect, useState } from "react";
import "../styles/customers.css";
import Link from "next/link";

interface Customer {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(4);
  const [editingCustomer, setEditingCustomer] =
  useState<Customer | null>(null);

const [editName, setEditName] = useState("");
const [editEmail, setEditEmail] = useState("");
const [editRole, setEditRole] = useState("");

    const saveCustomer = async () => {

    const res = await fetch("/api/customers", {
        method: "POST",

        headers: {
        "Content-Type": "application/json",
        },

        body: JSON.stringify({
        full_name: fullName,
        email,
        password_hash: password,
        role_id: roleId,
        status: "active",
        }),
    });

    const data = await res.json();

    if (data.success) {
        alert("Customer Created");
        location.reload();
    }
    };
    const openEditModal = (customer: Customer) => {
  setEditingCustomer(customer);

  setEditName(customer.full_name);
  setEditEmail(customer.email);
};

const updateCustomer = async () => {
  if (!editingCustomer) return;

  const res = await fetch(
    `/api/customers/${editingCustomer.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: editName,
        email: editEmail,
      }),
    }
  );

  const data = await res.json();

  if (data.success) {
    alert("Customer Updated");
    location.reload();
  } else {
    alert("Update Failed");
  }
};

const deleteCustomer = async (id: number) => {

  const confirmDelete = confirm(
    "Delete this customer?"
  );

  if (!confirmDelete) return;

  const res = await fetch(
    `/api/customers/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json();

  if (data.success) {
    alert("Customer Deleted");
    location.reload();
  } else {
    alert("Delete Failed");
  }
};

  return (
    
    <main
      style={{
        padding: "30px",
        color: "white",
        background: "#020817",
        minHeight: "100vh",
      }}
    >
        <div className="customers-header">

        <div className="header-left">
            <Link href="/dashboard" className="back-btn">← Back to Dashboard</Link>
            <span className="page-tag">CUSTOMERS</span>

            <h1>👥 Customer Management</h1>

            <p>
            Manage all customers, licenses and account status
            </p>

            <div className="stat-card">
            Total Customers
            <span>{customers.length}</span>
            </div>
        </div>

        <div className="header-right">

            <input
            type="text"
            placeholder="🔍 Search customer..."
            className="search-box"
            />

            <button
            className="add-user-btn"
            onClick={() => setShowModal(true)}
            >
            + Add Customer
            </button>

        </div>

        </div>

      <div className="table-wrapper">
      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
        </thead>
        

            <tbody>
            {customers.map((customer) => (
                <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.full_name}</td>
                <td>{customer.email}</td>
                <td>{customer.role}</td>

                <td>
                    <span className="status-active">
                    Active
                    </span>
                </td>
                <td>
                <button
                    className="edit-btn"
                    onClick={() => openEditModal(customer)}
                >
                    Edit
                </button>

                <button
                    className="delete-btn"
                    onClick={() => deleteCustomer(customer.id)}
                >
                    Delete
                </button>
                </td>

                </tr>
            ))}
            </tbody>

      </table>
      </div>

      {showModal && (

<div className="modal-overlay">

  <div className="modal-box">

    <h2>Add Customer</h2>

    <input
      placeholder="Full Name"
      value={fullName}
      onChange={(e) =>
        setFullName(e.target.value)
      }
    />

    <input
      placeholder="Email"
      value={email}
      onChange={(e) =>
        setEmail(e.target.value)
      }
    />

    <input
      placeholder="Password"
      value={password}
      onChange={(e) =>
        setPassword(e.target.value)
      }
    />

    <div className="modal-actions">

    <select
        value={roleId}
        onChange={(e) =>
        setRoleId(Number(e.target.value))
        }
    >
        <option value={1}>CEO</option>
        <option value={2}>Developer</option>
        <option value={3}>Admin</option>
        <option value={4}>Customer</option>
    </select>

    <button
        className="save-btn"
        onClick={saveCustomer}
    >
        Save Customer
    </button>

    <button
        className="cancel-btn"
        onClick={() => setShowModal(false)}
    >
        Cancel
    </button>

    </div>

  </div>

</div>

)}

{editingCustomer && (
  <div className="modal-overlay">
    <div className="modal-box">

      <h2>Edit Customer</h2>

      <input
        value={editName}
        onChange={(e) =>
          setEditName(e.target.value)
        }
      />

      <input
        value={editEmail}
        onChange={(e) =>
          setEditEmail(e.target.value)
        }
      />
      <div className="modal-actions">

      <button
        className="save-btn"
        onClick={updateCustomer}
      >
        Save Changes
      </button>

      <button
        className="cancel-btn"
        onClick={() =>
          setEditingCustomer(null)
        }
      >
        Cancel
      </button>
      </div>

    </div>
  </div>
)}

    </main>
  );
}
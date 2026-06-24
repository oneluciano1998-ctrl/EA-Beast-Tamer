"use client";

import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {

    const [stats, setStats] = useState({
  users: 0,
  licenses: 0,
  payments: 0,
  plans: 0,
});

useEffect(() => {
  fetch("/api/dashboard/stats")
    .then((res) => res.json())
    .then((data) => {
      setStats({
        users: data.users,
        licenses: data.licenses,
        payments: data.payments,
        plans: data.plans,
      });
    });
}, []);

  return (
    <main className="dashboard-layout">

      <aside className="sidebar">

        <div className="sidebar-logo">
          👑 Beast Tamer
        </div>

        <nav>

            <Link href="/dashboard">📊 Dashboard</Link>

         <Link href="/customers">👥 Customers</Link>

          <Link href="/licenses">🔑 Licenses</Link>

          <Link href="#">💳 Payments</Link>

          <Link href="#">⭐ Reviews</Link>

          <Link href="#">📥 Downloads</Link>

          <Link href="#">🤝 Brokers</Link>

          <Link href="#">📈 Performance</Link>

          <Link href="#">🎫 Support</Link>

          <Link href="#">⚙️ Settings</Link>

        </nav>

      </aside>

      <section className="dashboard-content">

        <h1>
          CEO Dashboard
        </h1>

<p>
  Welcome P&apos;ONE Luciano
</p>

<div className="stats-grid">

  <div className="stat-card">
    <h3>Users</h3>
    <span>{stats.users}</span>
  </div>

  <div className="stat-card">
    <h3>Licenses</h3>
    <span>{stats.licenses}</span>
  </div>

  <div className="stat-card">
    <h3>Payments</h3>
    <span>{stats.payments}</span>
  </div>

  <div className="stat-card">
    <h3>Plans</h3>
    <span>{stats.plans}</span>
  </div>

</div>

      </section>

    </main>
  );
}
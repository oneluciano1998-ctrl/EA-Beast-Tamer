"use client";

import Link from "next/link";
import { FaShieldAlt } from "react-icons/fa";
import { useState } from "react";
import "../styles/login.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  const response = await fetch(
    "/api/login",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data =
    await response.json();

  if (data.success) {
    alert("Login Success");

    window.location.href =
      "/dashboard";
  } else {
    alert(data.message);
  }
};
  return (
        <main className="login-page">

        <div className="bg-glow-top"></div>
        <div className="bg-glow-bottom"></div>

        <div className="login-container">

        <div className="status-badge-wrapper">
          <span className="status-badge">
            <span className="status-dot"></span>
            EA Auth Server Online
          </span>
        </div>
        

<div className="header-section">

            <div className="logo-box">
                <img
                src="/logoea.png"
                alt="EA Beast Tamer"
                className="login-logo"
                />
            </div>

            <h1 className="main-title">
                EA Beast
                <span className="gradient-text"> Tamer</span>
            </h1>

            <p className="subtitle">
                ระบบควบคุมสิทธิ์และการใช้งาน EA บัญชี MT4/MT5
            </p>

            </div>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label className="form-label">
              บัญชีผู้ใช้ / อีเมล
            </label>

            <div className="input-wrapper">
                <input
                type="text"
                className="form-input"
                placeholder="Username or email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
                />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              รหัสผ่าน
            </label>

            <div className="input-wrapper">
                <input
                type="password"
                className="form-input"
                placeholder="Security password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
                />
            </div>
          </div>

          <div className="options-row">

            <label className="checkbox-label">
              <input
                type="checkbox"
                className="hidden-checkbox"
              />
              <div className="custom-checkbox"></div>

              <span>
                จดจำการเข้าสู่ระบบ
              </span>
            </label>

            <a href="#" className="form-link">
              ลืมรหัสผ่าน?
            </a>

          </div>

          <button type="submit" className="submit-btn">
            เข้าสู่ระบบ Dashboard →
          </button>

          <div className="security-note-row">
            <span className="encryption-text">
            <FaShieldAlt className="shield-icon" />
            Protected by 256-bit Encryption
            </span>
          </div>

        </form>

        <div className="footer-divider">

            

          <p className="footer-text">
            ยังไม่มีบัญชีสมาชิกสำหรับใช้งาน EA?

            <Link href="/register">
              สมัครสมาชิกใหม่
            </Link>

          </p>

        </div>
    </div>
</main>
  );
}
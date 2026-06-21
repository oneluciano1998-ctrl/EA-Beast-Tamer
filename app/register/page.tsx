"use client";
import Link from "next/link";
import "../styles/register.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaShieldAlt
} from "react-icons/fa";

import {
  IoEye,
  IoEyeOff
} from "react-icons/io5";

import { useState } from "react";


export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
<main className="register-page">

  <div className="bg-glow-top"></div>
  <div className="bg-glow-bottom"></div>

  <div className="register-container">

        <img
          src="/logoea.png"
          alt="Beast Tamer"
          className="register-logo"
        />

<h1>
  Create <span>Account</span>
</h1>

<p className="register-subtitle">
  ระบบสมัครสมาชิกเพื่อใช้งาน EA Beast Tamer
  <br />
  และระบบ License สำหรับ MT4/MT5
</p>

        <form className="register-form">

            <div className="input-group">
  <FaUser className="input-icon" />

  <input
    type="text"
    placeholder="ตั้งชื่อผู้ใช้ของคุณ"
  />
</div>

<div className="input-group">
  <FaEnvelope className="input-icon" />

  <input
    type="email"
    placeholder="กรอกอีเมลจริง"
  />
</div>

<div className="input-group">

  <FaLock className="input-icon" />

  <input
    type={showPassword ? "text" : "password"}
    placeholder="ตั้งรหัสผ่าน"
  />

  <button
    type="button"
    className="eye-btn"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <IoEyeOff /> : <IoEye />}
  </button>

</div>

<div className="input-group">

  <FaLock className="input-icon" />

  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="ยืนยันรหัสผ่าน"
  />

  <button
    type="button"
    className="eye-btn"
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
  >
    {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
  </button>

</div>

<button className="register-submit">
  Create Account
  <FaUserPlus />
</button>
        </form>

        

          <div className="security-note-row">
            <span className="encryption-text">
            <FaShieldAlt className="shield-icon" />
            Protected by 256-bit Encryption
            </span>
          </div>

      <div className="login-divider"></div>



<div className="register-link">

  <span>
    Already have an account?
  </span>

  <Link href="/login">
    Login
  </Link>

</div>

      </div>

    </main>
  );
}
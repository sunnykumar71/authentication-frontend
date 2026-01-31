import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {

  const inputRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const { backendURL, userData, getUserData, isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    e.target.value = value;

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");

    paste.forEach((digit, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = digit;
      }
    });
    const next = paste.length < 6 ? paste.length : 5;
    inputRef.current[next].focus();
  };

  const handleVerify = async () => {
    const otp = inputRef.current.map(input => input.value).join("");
    if (otp.length !== 6) {
      toast.error("Please Enter all 6 digits of the OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}/verify-otp`, { otp }, { withCredentials: true });
      if (response.status === 200) {
        toast.success("OTP verified succussfully!");
        getUserData();
        navigate("/")
      }
      else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData?.isAccountVerified]);

  return (
    <div
      className=" email-verify-container d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{ background: "linear-gradient(90deg,#6a5af9,#8268f9)", borderRadius: "none" }}
    >

      <Link
        to="/"
        className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
      >
        <img src={assets.logo} alt="logo" height={32} width={32} />
        <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>

      <div className="bg-white p-5 rounded-4 shadow" style={{ width: "400px" }}>

        <h4 className="fw-bold text-center mb-2">Verify your email</h4>
        <p className="text-center mb-4">Enter the 6-digit OTP sent to your email</p>

        <div className="d-flex gap-2 mb-4 justify-content-center">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              ref={(el) => inputRef.current[i] = el}
              type="text"
              maxLength={1}
              className="form-control text-center fs-4 otp-input"
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="btn btn-primary w-100 fw-semibold">
          {loading ? "Verifying..." : "Verify Email"}
        </button>

      </div>
    </div>
  );
};

export default EmailVerify;

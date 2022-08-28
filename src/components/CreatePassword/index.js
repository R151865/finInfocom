import HOST from "../../constants/host";

import "./index.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CreatePassword() {
  const navigate = useNavigate();

  const [errMsg, setErrorMsg] = useState("");
  const [showPassword, showSetPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  // API Calls
  const sendEmailToGetOTPBackendAPI = async () => {
    const url = `${HOST}/api/user/send-otp-email`;
    const options = {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "content-type": "application/json",
        "x-csrf-token": "cnJmQDIwMjI=",
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      setShowOTP(true);
    } else {
      setErrorMsg(data.message);
    }
  };

  const createPasswordBackendAPI = async () => {
    const body = {
      email,
      otp,
      password,
    };
    const url = `${HOST}/api/user/set-password`;
    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        "x-csrf-token": "cnJmQDIwMjI=",
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log("create password", data);
    if (response.ok === true) {
      setShowSuccessView(true);
    } else {
      setErrorMsg(data.message);
    }
  };

  const verifyOTPBackendAPI = async () => {
    const body = {
      email,
      otp,
    };
    const url = `${HOST}/api/user/verify-otp`;
    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        "x-csrf-token": "cnJmQDIwMjI=",
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log("verify otp", data);
    if (response.ok === true) {
      console.log(data);
      // setShowOTPSection(true);
      showSetPassword(true);
    } else {
      setErrorMsg(data.message);
    }
  };

  // validations section
  const isValidEmail = () => {
    if (email === "") {
      setErrorMsg("Invalid email given");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const isValidOTP = () => {
    if (otp === "") {
      setErrorMsg("Invalid OTP given");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const isValidPassword = () => {
    if (password === "") {
      setErrorMsg("Invalid password given");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const onClickGetOTPButton = () => {
    if (isValidEmail()) {
      sendEmailToGetOTPBackendAPI();
      // send backend otp call
    }
  };

  const onClickCreatePasswordButton = () => {
    const isValidInputsGiven = isValidOTP() && isValidPassword();
    if (isValidInputsGiven) {
      createPasswordBackendAPI();
      // send backend call for results
    }
  };

  const getEmailSection = () => {
    return (
      <div className="email_section">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
        />
        <motion.button
          whileTap={{ scale: 1.1 }}
          onClick={onClickGetOTPButton}
          type="button"
          class="get_otp_button"
        >
          Get OTP
        </motion.button>
      </div>
    );
  };

  const onClickVerifyOTPButton = () => {
    const isValidInputsGiven = isValidEmail() && isValidOTP();
    if (isValidInputsGiven) {
      verifyOTPBackendAPI();
    }
  };

  const verifyOTPSection = () => {
    return (
      <>
        <p className="otp_note">OTP send to your email, valid upto 5min</p>

        <div className="verify_otp_section">
          <div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="OTP"
            />
          </div>
          <motion.button
            whileTap={{ scale: 1.1 }}
            className={
              showPassword ? "verified_otp_button" : "verify_otp_button"
            }
            type="button"
            onClick={onClickVerifyOTPButton}
          >
            {showPassword ? "Verified" : "Verify OTP"}
          </motion.button>
        </div>
      </>
    );
  };

  const getOTPSection = () => {
    return (
      <div>
        <div className="otp_section">
          <label>Create Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            placeholder="Enter password"
          />
        </div>

        <motion.button
          whileTap={{ scale: 1.1 }}
          onClick={onClickCreatePasswordButton}
          type="button"
          className="create_password__button"
        >
          Create password
        </motion.button>
      </div>
    );
  };

  const passwordCreatedSuccessView = () => {
    return (
      <div className="password_create_success">
        <div>
          <p>Password created successfully</p>
          <motion.button
            onClick={() => navigate("/login")}
            whileTap={{ scale: 1.1 }}
            type="button"
          >
            Go to login
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="create-password">
      {showSuccessView && passwordCreatedSuccessView()}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3 }}
        className="create_password__body"
      >
        {getEmailSection()}
        {showOTP && verifyOTPSection()}
        {showPassword && getOTPSection()}
        {errMsg.length > 0 ? (
          <p className="register_errorMsg">{errMsg}</p>
        ) : null}
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { TailSpin } from "react-loader-spinner";

import HOST from "../../constants/host";
import apiStatusConstants from "../../constants/apiStatusConstants";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import "./index.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const backendRegisterAPI = async () => {
    setApiStatus(apiStatusConstants.loading);
    const body = {
      email,
      fullName: name,
      mobile: mobile,
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAABDElEQVR42u3SMQEAAAgDoJnc6FrA0xMyUJl04FmJhViIhVhiIRZiIRaIhViIBWIhFmKBWIiFWCAWYiEWiIVYiAViIRZigViIhVggFmIhFoiFWIgFYiEWYoFYiIVYIBZiIRaIhViIBWIhFmKBWIiFWCAWYiEWiIVYiAViIRZigViIhVggFmIhFoiFWIgFYiEWYoFYiIVYIBZiIRaIhViIBWIhFmKBWIiFWIglFmIhFmKBWIiFWCAWYiEWiIVYiAViIRZigViIhVggFmIhFoiFWIgFYiEWYoFYiIVYIBZiIRaIhViIBWIhFmKBWIiFWCAWYiEWiIVYiAViIRZigViIhVggFmIhFoiFWIgFtwUbHOBr8Qik0gAAAABJRU5ErkJggg==",
      tandcAccepted: true,
    };
    const url = `${HOST}/api/user`;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-csrf-token": "cnJmQDIwMjI=",
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok === true) {
      setApiStatus(apiStatusConstants.success);
      navigate("/create-password");
    } else {
      setErrorMsg(data.message);
      setApiStatus(apiStatusConstants.success);
    }
  };

  const isValidName = () => {
    if (name === "") {
      setErrorMsg("Invalid name");
      return false;
    }

    if (name.length < 4) {
      setErrorMsg("Name should contains alteast 4 chars");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const isValidMobile = () => {
    if (mobile === "") {
      setErrorMsg("Invalid mobile");
      return false;
    }

    if (mobile.length < 10) {
      setErrorMsg("Mobile should contains alteast 10 digits");
      return false;
    }

    let numbStr = parseInt(mobile);
    numbStr = numbStr.toString();
    if (numbStr.length !== mobile.length) {
      setErrorMsg("Provide valid integers in mobile number");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const isValidEmail = () => {
    if (email === "") {
      setErrorMsg("Invalid email");
      return false;
    }

    if (!email.endsWith("@gmail.com")) {
      setErrorMsg("Email should contains @gmail.com");
      return false;
    }

    if (email.startsWith("@gmail.com")) {
      setErrorMsg("Provide valid email");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const validateFormAndReturnResult = () => {
    if (!isValidName()) {
      return false;
    }

    if (!isValidEmail()) {
      return false;
    }

    if (!isValidMobile()) {
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const onSubmitForm = (e) => {
    e.preventDefault();

    if (validateFormAndReturnResult()) {
      backendRegisterAPI();
    }
  };

  const getLoaderView = () => {
    return (
      <div className="register__loader">
        <TailSpin color="white" height="30px" />
      </div>
    );
  };

  const renderViewBasedOnApiStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return getLoaderView();
      case apiStatusConstants.success:
        return "Register";
      default:
        return "Register";
    }
  };

  return (
    <div className="register">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 3 }}
        className="register__body"
      >
        <h1>REGISTER</h1>

        <form onSubmit={onSubmitForm} className="register__form">
          <div>
            <label htmlFor="name">FULL NAME</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="John snow"
            />
          </div>

          <div>
            <label htmlFor="email">EMAIL</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label htmlFor="mobile">MOBILE NUMBER</label>
            <input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              type="text"
              placeholder="900000000"
            />
          </div>

          <div>
            <label>UPLOAD IMAGE</label>
            <input type="file" />
          </div>

          <motion.button
            whileTap={{ scale: 1.1 }}
            className="register-button"
            type="submit"
          >
            {renderViewBasedOnApiStatus()}
          </motion.button>

          {errorMsg.length > 0 ? (
            <p className="register_errorMsg">{errorMsg}</p>
          ) : null}

          <div>
            <div className="register_btmSec">
              <motion.button
                onClick={() => navigate("/create-password")}
                whileTap={{ scale: 1.1 }}
                className="already_have_account_btn"
                type="button"
              >
                Create password
              </motion.button>

              <motion.button
                onClick={() => navigate("/login")}
                whileTap={{ scale: 1.1 }}
                className="already_have_account_btn"
                type="button"
              >
                Already have account ?
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
